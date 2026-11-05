import { Routes } from '@angular/router'
import { SamIndexComponent } from './sam-index/sam-index.component'
import { UiCodeGenComponent } from './ui-code-gen/ui-code-gen.component'
import { ProductAndFeesComponent } from './product-and-fees/product-and-fees.component'
import { ProductAndFeesApiComponent } from './product-and-fees-api/product-and-fees-api.component'
import { ProductAndFeesMcpWorkaroundComponent } from './product-and-fees-mcp-workaround/product-and-fees-mcp-workaround.component'
import { ProductAndFeesMcpRealComponent } from './product-and-fees-mcp-real/product-and-fees-mcp-real.component'
import { ReportViewerComponent } from './report-viewer/report-viewer.component'

export const SAM_ROUTES: Routes = [
    {path: '', component: SamIndexComponent},
    {path: 'ui-code-gen', component: UiCodeGenComponent},
    {path: 'product-and-fees', component: ProductAndFeesComponent},
    {path: 'product-and-fees-api', component: ProductAndFeesApiComponent},
    {path: 'product-and-fees-mcp-workaround', component: ProductAndFeesMcpWorkaroundComponent},
    {path: 'product-and-fees-mcp-real', component: ProductAndFeesMcpRealComponent},
    {
        path: 'product-and-fees-api/report',
        component: ReportViewerComponent,
        data: {reportSrc: 'reports/api/products-pricing-card-report.html', reportTitle: 'Products & Pricing build report (Figma REST API)'}
    },
    {
        path: 'product-and-fees-mcp-workaround/report',
        component: ReportViewerComponent,
        data: {reportSrc: 'reports/mcp-workaround/products-pricing-card-report.html', reportTitle: 'Products & Pricing build report (Figma MCP workaround)'}
    },
    {
        path: 'product-and-fees-mcp-real/report',
        component: ReportViewerComponent,
        data: {reportSrc: 'reports/mcp-real/products-pricing-card-report.html', reportTitle: 'Products & Pricing build report (Figma MCP, real)'}
    }
];
