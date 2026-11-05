import { Routes } from '@angular/router'
import { SamIndexComponent } from './sam-index/sam-index.component'
import { UiCodeGenComponent } from './ui-code-gen/ui-code-gen.component'
import { ProductAndFeesComponent } from './product-and-fees/product-and-fees.component'
import { ProductAndFeesApiComponent } from './product-and-fees-api/product-and-fees-api.component'
import { ProductAndFeesMcpComponent } from './product-and-fees-mcp/product-and-fees-mcp.component'

export const SAM_ROUTES: Routes = [
    {path: '', component: SamIndexComponent},
    {path: 'ui-code-gen', component: UiCodeGenComponent},
    {path: 'product-and-fees', component: ProductAndFeesComponent},
    {path: 'product-and-fees-api', component: ProductAndFeesApiComponent},
    {path: 'product-and-fees-mcp', component: ProductAndFeesMcpComponent}
];
