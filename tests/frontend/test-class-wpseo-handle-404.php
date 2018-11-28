<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Handle_404_Test extends WPSEO_UnitTestCase {

	/**
	 * @var Expose_WPSEO_Handle_404
	 */
	private static $class_instance;

	/**
	 * Sets the handle 404 object.
	 *
	 * @return void;
	 */
	public function setUp() {
		parent::setUp();

		// Creates instance of WPSEO_Handle_404 class.
		self::$class_instance = new Expose_WPSEO_Handle_404();
	}

	/**
	 * Tests main feeds.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 */
	public function test_main_feeds() {
		// Go to default feed.
		$this->go_to( get_feed_link() );

		$this->assertTrue( self::$class_instance->is_main_feed() );

		// Go to comment feed.
		$this->go_to( get_feed_link( 'comments_rss2' ) );

		$this->assertTrue( self::$class_instance->is_main_feed() );

		// Go to home page.
		$this->go_to_home();

		$this->assertFalse( self::$class_instance->is_main_feed() );
	}

	/**
	 * Tests post comments feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_post_feeds() {
		$post      = $factory->post->create_and_get();
		$feed_link = get_post_comments_feed_link( $post->ID );

		// Go to post comments feed.
		$this->go_to( $feed_link );

		$this->assertFalse( self::$class_instance->is_main_feed() );

		$this->assertFalse( self::$class_instance->is_feed_404() );

		// Delete post.
		wp_delete_post( $post->ID );

		// Go to post comments feed.
		$this->go_to( $feed_link );

		$this->assertTrue( self::$class_instance->is_feed_404() );
	}

	/**
	 * Tests archive feeds.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	public function test_archive_feeds() {
		$category = $factory->category->create_and_get();
		$tag      = $factory->tag->create_and_get();

		$cat_link = $get_category_feed_link( $category->term_id, '' );
		$tag_link = $get_tag_feed_link( $tag->term_id, '' );

		// Go to category feed.
		$this->go_to( $cat_link );

		$this->assertFalse( self::$class_instance->is_main_feed() );

		$this->assertTrue( self::$class_instance->is_feed_404() );

		// Go to tag feed.
		$this->go_to( $tag_link );

		$this->assertFalse( self::$class_instance->is_main_feed() );

		$this->assertTrue( self::$class_instance->is_feed_404() );

		// Delete category and tag.
		wp_delete_category( $category->term_id );
		wp_delete_tag( $tag->term_id );

		// Go to category feed.
		$this->go_to( $cat_link );

		$this->assertFalse( self::$class_instance->is_feed_404() );

		// Go to tag feed.
		$this->go_to( $tag_link );

		$this->assertFalse( self::$class_instance->is_feed_404() );
	}

	/**
	 * Tests search feed.
	 *
	 * @covers WPSEO_Handle_404::is_main_feed()
	 * @covers WPSEO_Handle_404::is_feed_404()
	 */
	function test_search_feed() {
		$this->go_to( get_search_feed_link( 'Lorem' ) );

		$this->assertFalse( self::$class_instance->is_main_feed() );

		$this->assertFalse( self::$class_instance->is_feed_404() );
	}
}