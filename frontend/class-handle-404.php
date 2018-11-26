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
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'pre_handle_404', array( $this, 'handle_404' ) );
	}

	/**
	 * Handle the 404 status code.
	 *
	 * @param bool $handled Whether we've handled the request.
	 *
	 * @return bool True if it's 404.
	 */
	public function handle_404( $handled ) {

		if ( is_feed() && ! is_comment_feed() ) {
			return $this->is_feed_404( $handled );
		}

		return $handled;
	}

	/**
	 * If there are no posts in a feed, make it 404 instead of sending an empty RSS feed.
	 *
	 * @global WP_Query $wp_query
	 *
	 * @param bool $handled Whether we've handled the request.
	 *
	 * @return bool True if it's 404.
	 */
	private function is_feed_404( $handled ) {
		global $wp_query;

		// Don't 404 if the query contains posts or if it matched an object.
		if ( $wp_query->posts || $wp_query->get_queried_object() || $wp_query->is_home() ) {
			return $handled;
		}

		// Don't 404 if it's main feed.
		if ( ! $wp_query->is_archive() && ! $wp_query->is_singular() && $this->is_main_feed() ) {
			return $handled;
		}

		$wp_query->is_feed = false;
		$this->set_404();

		return true;
	}

	/**
	 * Determine whether this is the main feed.
	 *
	 * @global WP         $wp         Current WordPress environment instance.
	 * @global WP_Rewrite $wp_rewrite The WordPress rewrite class.
	 *
	 * @return bool Whether or not the request is the main feed.
	 */
	private function is_main_feed() {
		global $wp, $wp_rewrite;

		if ( empty( $wp->query_string ) && empty( $wp_rewrite->feeds ) ) {
			return false;
		}

		$feed_regex = '(' . implode( '|', array_map( 'trim', $wp_rewrite->feeds ) ) . ')';
		if ( preg_match( '`^feed=' . $feed_regex . '$`', $wp->query_string ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Sets the 404 status code.
	 *
	 * @global WP_Query $wp_query
	 *
	 * @return void
	 */
	private function set_404() {
		global $wp_query;

		// Overwrite Content-Type header.
		if ( ! headers_sent() ) {
			header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ), true );
		}

		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}
}
