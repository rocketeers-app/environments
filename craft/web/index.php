<?php
/**
 * Craft web bootstrap. The web root is web/, which is why the environment's public path is
 * `web` rather than `public`.
 */

define('CRAFT_BASE_PATH', dirname(__DIR__));

require CRAFT_BASE_PATH.'/vendor/autoload.php';

$dotenv = CRAFT_BASE_PATH.'/.env';

if (file_exists($dotenv)) {
    Dotenv\Dotenv::createUnsafeImmutable(CRAFT_BASE_PATH)->safeLoad();
}

$app = require CRAFT_BASE_PATH.'/vendor/craftcms/cms/bootstrap/web.php';

$app->run();
