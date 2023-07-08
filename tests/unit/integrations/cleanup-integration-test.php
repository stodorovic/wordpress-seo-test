<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Repositories\Indexable_Cleanup_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Cleanup_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Cleanup_Integration
 *
 * @group integrations
 */
class Cleanup_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Cleanup_Integration
	 */
	private $instance;

	/**
	 * The indexables repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The WPDB mock.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	private $wpdb;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Cleanup_Repository::class );

		$this->instance = new Cleanup_Integration(
			$this->indexable_repository
		);

		global $wpdb;

		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$this->wpdb = $wpdb;
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_start_cleanup_indexables', [ $this->instance, 'run_cleanup' ] ), 'Does not have expected wpseo_cleanup filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_cleanup_cron', [ $this->instance, 'run_cleanup_cron' ] ), 'Does not have expected run_cleanup_cron filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_deactivate', [ $this->instance, 'reset_cleanup' ] ), 'Does not have expected reset_cleanup filter' );
	}

	/**
	 * Tests that the class uses the right conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals( [], Cleanup_Integration::get_conditionals() );
	}

	/**
	 * Tests calling test_run_cleanup.
	 *
	 * @covers ::run_cleanup
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::reset_cleanup
	 */
	public function test_run_cleanup() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( Cleanup_Integration::CRON_HOOK );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->indexable_repository->shouldReceive( 'clean_indexables_with_object_type_and_object_sub_type' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_with_post_status' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_for_non_publicly_viewable_post' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_for_non_publicly_viewable_taxonomies' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_for_non_publicly_viewable_post_type_archive_pages' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_for_authors_archive_disabled' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_for_authors_without_archive' )->once();
		$this->indexable_repository->shouldReceive( 'update_indexables_author_to_reassigned' )->once();
		$this->indexable_repository->shouldReceive( 'clean_indexables_for_object_type_and_source_table' )->times( 3 );
		$this->indexable_repository->shouldReceive( 'cleanup_orphaned_from_table' )->times( 3 );

		$this->instance->run_cleanup();
	}

	/**
	 * Tests calling test_run_cleanup.
	 *
	 * @covers ::run_cleanup
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::reset_cleanup
	 */
	public function test_run_cleanup_db_query_failed() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( Cleanup_Integration::CRON_HOOK );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		/* Clean up of indexables with object_sub_type shop-order */
		$this->indexable_repository->shouldReceive( 'clean_indexables_with_object_type_and_object_sub_type' )->once()->andReturn( false );
		$this->instance->run_cleanup();
	}

	/**
	 * Tests whether run_cleanup starts the cron-job.
	 *
	 * @covers ::run_cleanup
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::reset_cleanup
	 * @covers ::start_cron_job
	 */
	public function test_run_cleanup_starts_cron_job() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$query_limit = 1000;

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->indexable_repository->shouldReceive( 'clean_indexables_with_object_type_and_object_sub_type' )->once()->andReturn( 1000 );
		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION, 'clean_indexables_with_object_type_and_object_sub_type_shop_order' );

		Monkey\Functions\expect( 'wp_schedule_event' )
			->once()
			->with( Mockery::type( 'int' ), 'hourly', Cleanup_Integration::CRON_HOOK );

		$this->instance->run_cleanup();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether the option is set to the next task when the current task is finished.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::start_cron_job
	 */
	public function test_run_cleanup_cron_next_task() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_with_object_type_and_object_sub_type_shop_order' );

		$query_limit = 1000;

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->indexable_repository->shouldReceive( 'clean_indexables_with_object_type_and_object_sub_type' )->once()->andReturn( 0 );

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION, 'clean_indexables_by_post_status_auto-draft' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is cleaned up after the last task is finished.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::start_cron_job
	 */
	public function test_run_cleanup_cron_last_task() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_orphaned_content_seo_links_target_indexable_id' );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->indexable_repository->shouldReceive( 'cleanup_orphaned_from_table' )->once()->andReturn( 0 );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is cleaned up when no tasks are left.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_cron_no_tasks_left() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( false );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is cleaned up when no tasks are left.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_limit
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_cron_db_query_failed() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_by_post_status_auto-draft' );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->indexable_repository->shouldReceive( 'clean_indexables_with_post_status' )->once()->andReturn( false );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is not cleaned up when there are still items left.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_limit
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_cron_items_left() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_by_post_status_auto-draft' );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->indexable_repository->shouldReceive( 'clean_indexables_with_post_status' )->once()->andReturn( 50 );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether the query limit is
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_limit
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_invalid_query_limit_from_filter() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_by_post_status_auto-draft' );

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( null );

		$this->indexable_repository->shouldReceive( 'clean_indexables_with_post_status' )->once()->andReturn( 50 );

		$this->instance->run_cleanup_cron();
	}
}
