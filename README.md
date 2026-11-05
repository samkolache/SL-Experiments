# sam-sandbox

A cut-down copy of ExosPrototypes that contains only the `sam` sandbox.

It uses the same Angular 20 / Bootstrap 5.3.8 versions (from the original lockfile), the same `angular.json` build setup, and the same alpaca/external themes. You can switch themes at runtime with the ThemeService.

## Run

```bash
npm install
npm start          # http://localhost:4200/sams-tests/sam
```

`npm run serve:local` runs the server on port 58530, the same as the main repo.

## Layout

Files are at the same paths as in ExosPrototypes, so you can copy them back one-to-one:

- `src/app/sandboxes/sam/`: the sandbox (index, tables, ui-code-gen, product-and-fees)
- `src/app/services/theme.service.ts`, `src/app/shared/theme-switcher/`: theme flipping
- `src/themes/`: alpaca + external theme entry points (built as `theme-*.css`, loaded at runtime)
- `src/assets/images/`: the images that product-and-fees uses

## Component registries

`exos-component-registry/` (alpaca) and `exos-component-registry-external/` are copied unchanged from ExosPrototypes. Each one has a drift check that confirms every class in the catalog still exists in the installed theme or Bootstrap SCSS:

```bash
npm run registry:check            # alpaca, checks this repo's node_modules
npm run registry:check:external   # external, run against this repo (--spa-root=.)
```

## Differences from the main repo

- `vendor/*.tgz` contains packed copies of `@exos/exos-theme-alpaca` and `@exos/exos-theme-external` (v0.1.2), so you don't need the private Azure feed.
- `main.ts` leaves out auth, App Insights (`@exos/exos-spa-platform`) and the global error handler. Routing, HTTP, animations and theme init are the same as the original.
- `/` redirects to `/sam`. The other sandboxes, the dashboard and the e-recording pages are not included.
