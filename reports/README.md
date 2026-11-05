# Figma → code reports

Three approaches to having AI build UI from Figma, all building the same "Confirm Products & Pricing" card.

| Approach | Route (under `/sams-tests`) | Code | Report | Instructions used |
| --- | --- | --- | --- | --- |
| Original (no redesign) | `/sam/product-and-fees` | `src/app/sandboxes/sam/product-and-fees/` | — | — |
| Figma REST API (from `api-test`) | `/sam/product-and-fees-api` | `src/app/sandboxes/sam/product-and-fees-api/` | [api/products-pricing-card-report.html](api/products-pricing-card-report.html) | [api/CLAUDE.md](api/CLAUDE.md), [api/html-report.md](api/html-report.md) |
| Figma MCP, local server workaround (from `mcp-again`) | `/sam/product-and-fees-mcp-workaround` | `src/app/sandboxes/sam/product-and-fees-mcp-workaround/` | [mcp-workaround/products-pricing-card-report.html](mcp-workaround/products-pricing-card-report.html) | [mcp-workaround/CLAUDE.md](mcp-workaround/CLAUDE.md), [mcp-workaround/report.md](mcp-workaround/report.md) |
| Figma MCP, real (from `mcp-real`) | `/sam/product-and-fees-mcp-real` | `src/app/sandboxes/sam/product-and-fees-mcp-real/` | [mcp-real/products-pricing-card-report.html](mcp-real/products-pricing-card-report.html) | [mcp-real/report.md](mcp-real/report.md) |

The API and MCP pages reuse the original page's header, sidebar, styles and data from `product-and-fees/`. Only each page shell, the new card and its pricing data live in each approach's folder (the MCP workaround card keeps its data inside the component).

The reports were written before the code was split into separate routes, so file paths inside them point to `product-and-fees/`.

## Hosted reports

Every `reports/*/products-pricing-card-report.html` is copied into the build output by an asset entry in `angular.json`, and shown full-page at:

- `/sams-tests/sam/product-and-fees-api/report`
- `/sams-tests/sam/product-and-fees-mcp-workaround/report`
- `/sams-tests/sam/product-and-fees-mcp-real/report`

The raw files are also served directly at `/sams-tests/reports/<approach>/products-pricing-card-report.html`.
