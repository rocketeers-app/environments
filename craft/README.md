# Craft CMS

Detected from `composer.lock` (`craftcms/cms`), served from `web/` by php-fpm.

Craft cannot render anything until its schema exists, so after the first deploy run the
installer once against the managed database:

```
php craft install
```

Then `/` renders `templates/index.twig`, which is the placeholder page.

`storage/` is a persistent path: it holds compiled templates, logs and the image transform
cache, and is kept across releases rather than rebuilt on every deploy.
