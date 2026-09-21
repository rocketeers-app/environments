# Drupal

Detected from `composer.lock` (`drupal/core`), served from `web/` by php-fpm.

Drupal cannot render anything until its schema exists, so the first deploy installs the
dependencies and stops there — the deploy task skips `updatedb`, config import and deploy hooks
for a site that does not bootstrap yet. Run the installer once against the managed database:

```
drush site:install rocketeers --account-pass='<a password>' -y
```

Then `/` renders the placeholder page and `/user/login` is the admin. Every later deploy runs
`drush updatedb`, `drush config:import` (only when `config/sync` holds exported config) and
`drush deploy:hook`.

## How it is wired

`web/sites/default/settings.php` is committed and holds no credentials. It is the only place the
environment variables Rocketeers seeds are read:

| Variable | What it sets |
|---|---|
| `DATABASE_URL` | `$databases['default']['default']`, spelled out driver-by-driver |
| `HASH_SALT` | `$settings['hash_salt']` — regenerating it drops every session |
| `PRIMARY_SITE_URL` | the one entry in `$settings['trusted_host_patterns']` |
| `DRUPAL_ENV` | `production` hides errors and turns on CSS/JS aggregation |

The connection array is written out by hand rather than through
`Database::convertDbUrlToConnectionInfo()`: that helper finds the driver module by scanning the
filesystem, which is too early to be reliable in `settings.php`, and its `$root` argument is
deprecated as of Drupal 11.3. Rocketeers seeds a URL Drupal's own tooling accepts either way —
PostgreSQL arrives as `pgsql://`, not `postgres://`, because `pgsql` is the driver's name.

## Persistent paths

`web/sites/default/files` (public files) and `private` (`$settings['file_private_path']`) are
kept across releases rather than rebuilt, the way Laravel's `storage/` is. Everything else —
core, contrib modules and themes — comes back from the lockfile on every deploy.

## The placeholder page

`web/profiles/rocketeers` is a one-line install profile whose only job is to enable
`web/modules/custom/rocketeers_placeholder`, which serves the placeholder page at `/placeholder`
as a plain response, so it renders identically to the other environment types instead of inside
a Drupal theme. `settings.php` pins that path as the front page, so it survives a reinstall.

## Not covered here

Redis. Drupal reaches a cache backend through the contrib `redis` module rather than a core
setting, so `REDIS_URL` is seeded but nothing reads it until that module is required and wired up
in `settings.php`.
