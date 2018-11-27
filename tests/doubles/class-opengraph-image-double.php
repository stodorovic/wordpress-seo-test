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

        public function init_frontend_page_type() {                
                // Class for determine the current page type.
                $this->frontend_page_type = new WPSEO_Frontend_Page_Type();
        }

	/**
	 * @inheritdoc
	 */
	public function set_images() {
		parent::set_images();
	}
}
