# Exos Component Registry — Index (exos-theme-external)

Routing entry point for the Exos UI agent, grounded in **`@exos/exos-theme-external`** (as installed
in the VendorOnBoardingSpa). **Read this file first**, then open only the component JSON files you
need. Do not load all files up front.

Each component JSON shares the same schema (`_schema/exos-catalog.schema.json`): `baseClass`, `axes`
(variant dimensions), `structure` (composition), `examples` (copy-pasteable HTML), `inference`
(intent → variant), `rules`, `a11y`. Every class is verified against the installed theme SCSS by
`scripts/check-drift.mjs` (run it with `--spa-root=/path` or `EXOS_SPA_ROOT` to point at a different SPA).

## Foundation

| File | What it holds | Use when |
|------|---------------|----------|
| [`tokens.json`](tokens.json) | Theme colors, tints, grays, diagram colors, **wide type scale (t-10…t-24 + fs-*)**, **radius scale**, dialog widths, gradients, per-component tokens | You need a color/spacing/size value, or to style custom markup with real tokens |

## Components

| Component | File | Use when the UI needs… |
|-----------|------|------------------------|
| Button | [`button.json`](button.json) | An action: submit/save/cancel/delete, icon buttons, links styled as buttons |
| Card | [`card.json`](card.json) | A surface that groups content; panels, sections, nav cards (rounded corners + shadow in this theme) |
| Alert | [`alert.json`](alert.json) | Inline notifications: primary/success/danger/warning/secondary |
| Forms | [`forms.json`](forms.json) | Text inputs, selects, checkboxes/radios/switches (BS5 `form-check` path), validation |
| Typography | [`typography.json`](typography.json) | Sized text `t-10…t-24` / `fs-10…fs-24`, `small-bolded-text` |
| Chip | [`chip.json`](chip.json) | Selectable filter chips (checkbox/radio styled pills) |
| Tag | [`tag.json`](tag.json) | Color-coded labels: provider, status, order, status-pill |
| Modal | [`modal.json`](modal.json) | Dialogs, sizes sm–xxl, slide-out (note: theme also has a separate native-`<dialog>` fluid-dialog system) |
| Table | [`table.json`](table.json) | Tabular data; striped/bordered/card-layout tables |
| Navigation | [`navigation.json`](navigation.json) | App navbar, side navigation, pagination, dropdown menus |
| Icons | [`icons.json`](icons.json) | Icomoon `icon-*` glyphs inside other components |

## How to use this catalog

1. Match the requested UI to the components above; open those JSON files.
2. Read each component's `inference` to pick variants from intent, then its `examples`/`axes` to
   compose exact classes.
3. Use **only** classes present in the catalog. For gaps, build custom markup from Bootstrap
   utilities + `tokens.json` values — never invent design-system class names.
4. Layout glue (Bootstrap utilities: `d-flex`, `row`, `col-*`, `gap-*`, `mb-*`) is always allowed.

## Notes specific to this theme (vs alpaca)

- **Rounded corners**: buttons/cards use `radius-*` tokens, not square corners.
- **Wider type scale**: `t-10`, `t-20`, `t-24` and `fs-*` aliases exist here (alpaca had only t-12…t-18).
- **More tag variants**: tags generate across theme + diagram colors (incl. `tealGreen`); a
  `status-pill` family also exists.
- **Separate fluid-dialog system** (native `<dialog>`) lives alongside Bootstrap modals — see
  `modal.json` description; it was intentionally not folded into the modal entry.
