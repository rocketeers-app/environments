<?php

/**
 * @file
 * Rocketeers-managed Drupal settings.
 *
 * Drupal has no .env convention of its own, so this file is the contract: Rocketeers seeds
 * DATABASE_URL, HASH_SALT, PRIMARY_SITE_URL and DRUPAL_ENV into the environment's .env, and
 * nothing else reads them. Keep it in the repository — it holds no credentials.
 */

$project_root = dirname($app_root);

if (file_exists($project_root . '/.env')) {
  Dotenv\Dotenv::createUnsafeImmutable($project_root)->safeLoad();
}

$settings['hash_salt'] = (string) getenv('HASH_SALT');
$settings['config_sync_directory'] = $project_root . '/config/sync';
$settings['file_private_path'] = $project_root . '/private';
$settings['file_temp_path'] = sys_get_temp_dir();
$settings['update_free_access'] = FALSE;

/**
 * Spell the connection out rather than calling Database::convertDbUrlToConnectionInfo(): that
 * helper discovers the driver module by scanning the filesystem, which settings.php is too
 * early in the bootstrap to do reliably, and its $root argument is deprecated since 11.3. The
 * array below is the shape Drupal's own installer writes, and Settings::initialize() registers
 * the `autoload` path with the class loader.
 */
if ($database_url = getenv('DATABASE_URL')) {
  $url = parse_url((string) $database_url);
  $driver = ($url['scheme'] ?? 'mysql') === 'postgres' ? 'pgsql' : ($url['scheme'] ?? 'mysql');

  $databases['default']['default'] = [
    'driver' => $driver,
    'namespace' => 'Drupal\\' . $driver . '\\Driver\\Database\\' . $driver,
    'autoload' => 'core/modules/' . $driver . '/src/Driver/Database/' . $driver . '/',
    'database' => ltrim((string) ($url['path'] ?? ''), '/'),
    'username' => isset($url['user']) ? rawurldecode($url['user']) : '',
    'password' => isset($url['pass']) ? rawurldecode($url['pass']) : '',
    'host' => $url['host'] ?? 'localhost',
    'port' => $url['port'] ?? ($driver === 'pgsql' ? 5432 : 3306),
    'prefix' => '',
  ];
}

if ($site_url = getenv('PRIMARY_SITE_URL')) {
  $settings['trusted_host_patterns'][] = '^' . preg_quote((string) parse_url($site_url, PHP_URL_HOST), '/') . '$';
}

$production = getenv('DRUPAL_ENV') === 'production';

$config['system.logging']['error_level'] = $production ? 'hide' : 'verbose';
$config['system.performance']['css']['preprocess'] = $production;
$config['system.performance']['js']['preprocess'] = $production;

// The placeholder module owns /placeholder; forcing it here means the front page survives a
// reinstall and cannot be edited away in the admin UI.
$config['system.site']['page']['front'] = '/placeholder';
