# Payload

Detected from `package.json` (`payload`), which is probed **before** `next`: a Payload 3 app is
a Next.js app, and without that ordering it would deploy as `nextjs` and lose its own driver.

The admin panel is mounted by Payload's own route group; `/` renders the placeholder page.
Create the first admin user once at `/admin` after the first deploy.

`media/` is a persistent path — it holds the uploads and, on this SQLite setup, the database
file. `PAYLOAD_SECRET` is generated into the env file by Rocketeers when the environment is
created; rotating it invalidates every existing login and API key.

The Payload admin routes are not included here, so this folder covers detection, build, start
and the placeholder page rather than a full CMS install.
