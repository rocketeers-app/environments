<?php

use craft\config\DbConfig;

// CRAFT_DB_DSN, CRAFT_DB_USER and CRAFT_DB_PASSWORD are seeded into .env by Rocketeers from
// the managed database attached to the environment.
return DbConfig::create();
