import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadguiaPage } from './cadguia.page';

const routes: Routes = [
  {
    path: '',
    component: CadguiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadguiaPageRoutingModule {}
