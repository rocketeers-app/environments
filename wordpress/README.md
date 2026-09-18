# WordPress

Rocketeers does not deploy WordPress from git: WordPress is installed and managed on the server
by the WordPress environment itself. This folder only carries the landing page theme.

1. Upload `wp-content/themes/rocketeers/` to `wp-content/themes/` of the server-managed install
   (SFTP, or zip the folder and use **Appearance → Themes → Add New → Upload Theme**).
2. Activate it under **Appearance → Themes**, or with `wp theme activate rocketeers`.

`wp-cli.yml` is only here so Rocketeers detects this folder as WordPress.
