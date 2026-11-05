import { Routes } from '@angular/router'
import { SamIndexComponent } from './sam-index/sam-index.component'
import { UiCodeGenComponent } from './ui-code-gen/ui-code-gen.component'
import { ProductAndFeesComponent } from './product-and-fees/product-and-fees.component'
import { ProductAndFeesApiComponent } from './product-and-fees-api/product-and-fees-api.component'
import { ProductAndFeesMcpComponent } from './product-and-fees-mcp/product-and-fees-mcp.component'
import { ReportViewerComponent } from './report-viewer/report-viewer.component'

export const SAM_ROUTES: Routes = [
    {path: '', component: SamIndexComponent},
    {path: 'ui-code-gen', component: UiCodeGenComponent},
    {path: 'product-and-fees', component: ProductAndFeesComponent},
    {path: 'product-and-fees-api', component: ProductAndFeesApiComponent},
    {path: 'product-and-fees-mcp', component: ProductAndFeesMcpComponent},
    {
        path: 'product-and-fees-api/report',
        component: ReportViewerComponent,
        data: {reportSrc: 'reports/api/products-pricing-card-report.html', reportTitle: 'Products & Pricing build report (Figma REST API)'}
    },
    {
        path: 'product-and-fees-mcp/report',
        component: ReportViewerComponent,
        data: {reportSrc: 'reports/mcp/products-pricing-card-report.html', reportTitle: 'Products & Pricing build report (Figma MCP)'}
    }
];
