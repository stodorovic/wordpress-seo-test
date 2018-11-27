<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Opengraph_Image_Double extends WPSEO_OpenGraph_Image {

        public function __construct() {
                        parent::__construct();
                                }
	/**
	 * @inheritdoc
	 */
	public function set_images() {
		parent::set_images();
	}
}
