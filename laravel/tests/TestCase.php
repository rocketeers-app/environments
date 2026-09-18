<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

// The activity log lives on its own connection. Outside of tests that connection
// points at a second database on the same server, but an in-memory SQLite
// database cannot be shared between connections, so tests reuse the default one.
abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        DB::extend('pgsql_activitylog', fn () => DB::connection(config('database.default')));
        DB::purge('pgsql_activitylog');
    }
}
