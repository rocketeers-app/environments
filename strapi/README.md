# Strapi

Detected from `package.json` (`@strapi/strapi`), served over a loopback port.

Strapi owns `/` with its own welcome screen and admin panel, so the placeholder page is served
at `/home` instead. The first deploy needs an admin user created once at `/admin`.

`.tmp/` (the default SQLite database) and `public/uploads/` are persistent paths — a release
local uploads directory loses the whole media library on the next deploy.

`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT` and `JWT_SECRET` are
generated into the env file by Rocketeers when the environment is created.
