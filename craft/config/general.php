<?php

use craft\config\GeneralConfig;

return GeneralConfig::create()
    ->defaultWeekStartDay(1)
    ->omitScriptNameInUrls()
    ->preventUserEnumeration()
    ->devMode(false);
