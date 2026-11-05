# Figma → code reports

Two approaches to having AI build UI from Figma, both building the same "Confirm Products & Pricing" card.

| Approach | Route | Code | Report | Instructions used |
| --- | --- | --- | --- | --- |
| Original (no redesign) | `/sam/product-and-fees` | `src/app/sandboxes/sam/product-and-fees/` | — | — |
| Figma REST API | `/sam/product-and-fees-api` | `src/app/sandboxes/sam/product-and-fees-api/` | [api/products-pricing-card-report.html](api/products-pricing-card-report.html) | [api/CLAUDE.md](api/CLAUDE.md), [api/html-report.md](api/html-report.md) |
| Figma MCP (local server workaround) | `/sam/product-and-fees-mcp` | `src/app/sandboxes/sam/product-and-fees-mcp/` | [mcp/products-pricing-card-report.html](mcp/products-pricing-card-report.html) | [mcp/CLAUDE.md](mcp/CLAUDE.md), [mcp/HOW-TO-BUILD-REPORT.md](mcp/HOW-TO-BUILD-REPORT.md) |

The API and MCP pages reuse the original page's header, sidebar, styles and data from `product-and-fees/`. Only the new card and its pricing data live in each approach's folder.

The reports were written before the code was split into separate routes, so file paths inside them point to `product-and-fees/`.
