<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Rewrite_Test extends WPSEO_UnitTestCase {

	/**
	 * @var string
	 */
	private $flush_option_name = 'wpseo_flush_rewrite';

	/**
	 * @var WPSEO_Rewrite
	 */
	private static $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		self::$class_instance = new WPSEO_Rewrite();
	}

	/**
	 * @covers WPSEO_Rewrite::schedule_flush
	 */
	public function test_schedule_flush() {
		self::$class_instance->schedule_flush();
		$this->assertTrue( get_option( $this->flush_option_name ) === 1 );
	}

	/**
	 * @covers WPSEO_Rewrite::flush
	 */
	public function test_flush() {
		delete_option( $this->flush_option_name );

		$this->assertFalse( self::$class_instance->flush() );

		self::$class_instance->schedule_flush();
		$this->assertTrue( self::$class_instance->flush() );
	}

	/**
	 * @covers WPSEO_Rewrite::no_category_base
	 */
	public function test_no_category_base() {

		$input         = 'http://yoast.com/cat/link/';
		$category_base = get_option( 'category_base' );

		if ( empty( $category_base ) ) {
			$category_base = 'category';
		}

		// Remove initial slash, if there is one (we remove the trailing slash in the regex replacement and don't want to end up short a slash).
		if ( '/' === substr( $category_base, 0, 1 ) ) {
			$category_base = substr( $category_base, 1 );
		}

		$category_base .= '/';

		$expected = preg_replace( '`' . preg_quote( $category_base, '`' ) . '`u', '', $input, 1 );
		$this->assertEquals( $expected, self::$class_instance->no_category_base( $input ) );
	}

	/**
	 * @covers WPSEO_Rewrite::query_vars
	 */
	public function test_query_vars() {
		$this->assertEquals( array(), self::$class_instance->query_vars( array() ) );

		WPSEO_Options::set( 'stripcategorybase', true );
		$this->assertEquals( array( 'wpseo_category_redirect' ), self::$class_instance->query_vars( array() ) );
	}

	/**
	 * @covers WPSEO_Rewrite::request
	 */
	public function test_request() {
		// @todo Find method to test redirects.
	}

	/**
	 * @covers WPSEO_Rewrite::category_rewrite_rules
	 */
	public function test_category_rewrite_rules() {
		global $wp_rewrite;

		$c = self::$class_instance;

		$categories          = get_categories( array( 'hide_empty' => false ) );
		$permalink_structure = get_option( 'permalink_structure' );

		$blog_prefix = str_replace( $this->get_category_base() . '%category%', '', $wp_rewrite->get_category_permastruct() );
		$blog_prefix = ltrim( $blog_prefix, '/' );

		$category_rewrite_rules = array(
			'(%category%)/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$' => 'index.php?category_name=$matches[1]&feed=$matches[2]',
			'(%category%)/page/?([0-9]{1,})/?$' => 'index.php?category_name=$matches[1]&paged=$matches[2]',
			'(%category%)/?$'                   => 'index.php?category_name=$matches[1]',
		);

		$expected = array();

		foreach( $categories as $category ) {
			foreach( $category_rewrite_rules as $regex => $rule ) {

				$slug_regex = $blog_prefix . '(' . $category->slug . ')';
				$regex2     = str_replace( '(%category%)', $slug_regex, $regex );

				$expected[ $regex2 ] = $rule;
			}
		}

		$old_base = trim( str_replace( '%category%', '(.+)', $wp_rewrite->get_category_permastruct() ), '/' );

		$expected[ $old_base . '$' ] = 'index.php?wpseo_category_redirect=$matches[1]';

		$this->assertEquals( $expected, $c->category_rewrite_rules() );
	}

	/**
	 * Retrieves category base.
	 *
	 * @return string
	 */
	private function get_category_base() {
		$category_base = get_option( 'category_base' );

		if ( empty( $category_base ) ) {
			$category_base = 'category';
		}

		// Remove initial slash, if there is one (we remove the trailing slash in the regex replacement and don't want to end up short a slash).
		if ( '/' === substr( $category_base, 0, 1 ) ) {
			$category_base = substr( $category_base, 1 );
		}

		return $category_base . '/';
	}
}
