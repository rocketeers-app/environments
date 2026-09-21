# Rocketeers environments

One example app for every environment type Rocketeers supports, in a single monorepo. Each folder
is a self-contained app that renders the Rocketeers placeholder page with its own name:

> **<u>Laravel</u>** is ready for take off!

Use it to check that every type is detected, built, deployed and served correctly.

## Deploying one

Create an environment from this repository and set **Root directory** to the folder. Rocketeers
detects the type from that folder and deploys only that folder.

### PHP

| Folder | Environment type | Deployment task |
|---|---|---|
| `laravel` | Laravel | Deploy Laravel app |
| `statamic` | Statamic | Deploy Laravel app |
| `symfony` | Symfony | Deploy Symfony app |
| `craft` | Craft CMS | Deploy Craft CMS site |
| `drupal` | Drupal | Deploy Drupal site |
| `wordpress` | WordPress | — (managed on the server, see its README) |
| `php` | PHP | a custom task, e.g. `true` (there is nothing to build) |

### JavaScript

| Folder | Environment type | Deployment task |
|---|---|---|
| `node` | Node.js | Deploy Node.js app |
| `nextjs` | Next.js | Deploy Next.js app |
| `nuxt` | Nuxt | Deploy Node.js app |
| `sveltekit` | SvelteKit | Deploy Node.js app |
| `remix` | Remix / React Router | Deploy Node.js app |
| `nestjs` | NestJS | Deploy Node.js app |
| `adonisjs` | AdonisJS | Deploy AdonisJS app |
| `ghost` | Ghost | Deploy Node.js app |
| `strapi` | Strapi | Deploy Node.js app |
| `payload` | Payload | Deploy Node.js app |
| `bun` | Bun | Deploy Bun app |
| `deno` | Deno | Deploy Deno app |

### Static

| Folder | Environment type | Web root | Deployment task |
|---|---|---|---|
| `static` | Static Site | `public` | Deploy static site |
| `astro` | Astro | `dist` | Deploy Astro or Vite site |
| `vite` | Vite | `dist` | Deploy Astro or Vite site |
| `jekyll` | Jekyll | `_site` | Deploy Jekyll site |
| `gatsby` | Gatsby | `public` | Deploy static site generator |
| `eleventy` | Eleventy | `_site` | Deploy static site generator |
| `docusaurus` | Docusaurus | `build` | Deploy static site generator |
| `angular` | Angular | `dist` | Deploy static site generator |
| `cra` | Create React App | `build` | Deploy static site generator |
| `vuecli` | Vue CLI | `dist` | Deploy static site generator |

Each generator writes its build somewhere different, which is why the web root is part of the
type rather than something the deploy task normalises. A stock Angular app writes
`dist/<project>/browser`; this one sets `outputPath` to plain `dist` so it matches the type's
web root without an edit. Jekyll is the odd one out twice over: it is the only static type that
needs a language toolchain (Ruby) to build at all.

### Python, Ruby, Go, Rust

| Folder | Environment type | Deployment task |
|---|---|---|
| `django` | Django | Deploy Django app |
| `fastapi` | FastAPI | Deploy Python app |
| `flask` | Flask | Deploy Python app |
| `litestar` | Litestar | Deploy Python app |
| `python` | Python | Deploy Python app |
| `rails` | Ruby on Rails | Deploy Rails app |
| `go` | Go | Deploy Go app |
| `rust` | Rust | Deploy Rust app |

### Elixir and the JVM

| Folder | Environment type | Deployment task |
|---|---|---|
| `elixir` | Elixir | Deploy Elixir app |
| `phoenix` | Phoenix | Deploy Phoenix app |
| `java` | Java / Kotlin | Deploy Java app |
| `springboot` | Spring Boot | Deploy Spring Boot app |
| `ktor` | Ktor | Deploy Ktor app |

Elixir releases are linked to `bin/app` and the JVM jars to `bin/app.jar`, the same convention
`go` and `rust` already use, so the daemon command never has to know the project's name.

The three JVM folders build through the committed Maven wrapper. `mvnw` downloads its own
`maven-wrapper.jar` from Maven Central on first run, so no binary is checked in here. `ktor`
uses Maven rather than Gradle for the same reason — a Gradle wrapper needs `gradle-wrapper.jar`
committed — which means the Gradle branch of the Ktor deploy task is not covered by this repo.

A push only redeploys the environments whose folder it changed.

## Folders that need one setup step

Most folders render the placeholder page on the first deploy. These five are real CMSes and
need one action afterwards; each has its own README with the detail.

| Folder | What it still needs |
|---|---|
| `craft` | `php craft install` once, against the managed database |
| `drupal` | `drush site:install rocketeers` once, against the managed database |
| `ghost` | nothing, but it renders its own theme rather than the placeholder page |
| `strapi` | an admin user at `/admin`; the placeholder page is at `/home`, since Strapi owns `/` |
| `payload` | an admin user at `/admin` |

## Variants

Folders named `<type>-<variant>` deploy as the same type but take a different path through
detection or the deploy script, so those branches get exercised too.

| Folder | Environment type | What it covers |
|---|---|---|
| `nextjs-pnpm` | Next.js | pnpm lockfile branch of the Next.js deploy task |
| `vite-yarn` | Vite | Yarn 4 (Corepack) lockfile branch |
| `node-bun` | Node.js | Bun lockfile branch, app without a build script |
| `fastapi-uv` | FastAPI | `pyproject.toml` + `uv.lock` instead of `requirements.txt` |
| `wordpress-bedrock` | WordPress | detection through Bedrock's `composer.lock` |
| `static-hugo` | Static Site | Hugo pinned in `go.mod`, built through npm (`hugo-extended`) into `public/` |
| `laravel-octane` | Laravel | Octane detection and the FrankenPHP app server |
| `laravel-horizon` | Laravel | Horizon detection and its daemon |

`node-bun` and `bun` are the pair worth reading together: both carry a bun lockfile, and the
one with `express` in `package.json` stays **Node.js** while the one without becomes **Bun**. A
lockfile alone is what selects the runtime; a framework in `package.json` always wins.

Among the new folders only `craft` and `drupal` commit a lockfile. The others rely on the deploy task's
`npm install` / `mix deps.get` / `mvnw package` fallback, which is the branch a repository
without a committed lockfile takes anyway.

## Adding a type

Add a folder named after the environment type key, make `/` render the placeholder page with the
type's name, and make sure the folder is detected as that type on its own: detection only looks
at the folder, never at the rest of the repository.
