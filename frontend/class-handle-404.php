<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_Handle_404
 *
 * Handles intercepting requests.
 *
 * @since 9.4
 */
class WPSEO_Handle_404 implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'pre_handle_404', array( $this, 'handle_404' ) );
	}

	/**
	 * Handle 404.
	 *
	 * @param boolean $handled Whether we've handled the request.
	 *
	 * @return bool True if it should be 404.
	 */
	public function handle_404( $handled ) {

		if ( is_feed() ) {
			return $this->is_feed_invalid( $handled );
		}

		return $handled;
	}

	/**
	 * If there are no posts in a feed, make it 404 instead of sending an empty RSS feed.
	 *
	 * @param boolean $handled Whether we've handled the request.
	 * @global WP_Query $wp_query
	 *
	 * @return bool True if it's 404.
	 */
	private function is_feed_invalid( $handled ) {
		global $wp_query;

		// Don't 404 for these queries if they matched an object.
		if ( ( is_author() || is_tag() || is_category() || is_tax() || is_post_type_archive() )
			&& get_queried_object()
		) {
			return $handled;
		}

		// Don't 404 if query contains posts.
		if ( $wp_query->posts ) {
			return $handled;
		}

		$wp_query->is_feed = false;
		$this->set_404();

		return true;
	}

	/**
	 * Sets the 404 status.
	 *
	 * @return void
	 */
	private function set_404() {
		global $wp_query;

		// Overwrite Content-Type header if it needs.
		$headers = function_exists( 'headers_list' ) ? headers_list() : array();
		if ( ! headers_sent() && preg_grep( '`^Content-Type: `', $headers ) ) {
			header( 'Content-Type: ' . get_bloginfo( 'html_type' ) . '; charset=' . get_bloginfo( 'charset' ), true );
		}

		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}
}
