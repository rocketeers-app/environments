# Rocketeers environments

One example app for every environment type Rocketeers supports, in a single monorepo. Each folder
is a self-contained app that renders the Rocketeers placeholder page with its own name:

> **<u>Laravel</u>** is ready for take off!

Use it to check that every type is detected, built, deployed and served correctly.

## Deploying one

Create an environment from this repository and set **Root directory** to the folder. Rocketeers
detects the type from that folder and deploys only that folder.

| Folder | Environment type | Deployment task |
|---|---|---|
| `laravel` | Laravel | Deploy Laravel app |
| `statamic` | Statamic | Deploy Laravel app |
| `symfony` | Symfony | Deploy Symfony app |
| `wordpress` | WordPress | — (managed on the server, see its README) |
| `php` | PHP | a custom task, e.g. `true` (there is nothing to build) |
| `static` | Static Site | Deploy static site |
| `node` | Node.js | Deploy Node.js app |
| `nextjs` | Next.js | Deploy Next.js app |
| `nuxt` | Nuxt | Deploy Node.js app |
| `sveltekit` | SvelteKit | Deploy Node.js app |
| `remix` | Remix / React Router | Deploy Node.js app |
| `nestjs` | NestJS | Deploy Node.js app |
| `astro` | Astro | Deploy Astro or Vite site |
| `vite` | Vite | Deploy Astro or Vite site |
| `django` | Django | Deploy Django app |
| `fastapi` | FastAPI | Deploy Python app |
| `flask` | Flask | Deploy Python app |
| `python` | Python | Deploy Python app |
| `rails` | Ruby on Rails | Deploy Rails app |
| `go` | Go | Deploy Go app |
| `rust` | Rust | Deploy Rust app |

A push only redeploys the environments whose folder it changed.

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

## Adding a type

Add a folder named after the environment type key, make `/` render the placeholder page with the
type's name, and make sure the folder is detected as that type on its own: detection only looks
at the folder, never at the rest of the repository.
