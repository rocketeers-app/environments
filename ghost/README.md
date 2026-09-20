# Ghost

Detected from `package.json` (`ghost`), served over a loopback port.

Ghost renders its own theme rather than a placeholder page, so this folder checks that the type
is detected, installed and booted — not that a specific page renders.

`content/` is a persistent path. It holds the themes, uploaded images and, on the default
SQLite setup, the database file itself, so it is kept across releases. Losing it is losing the
site, which is the whole reason this type has a driver of its own rather than being plain Node.

Environment variables are seeded in Ghost's own double-underscore form
(`database__client`, `database__connection__host`, ...), because Ghost ignores `DATABASE_URL`.
