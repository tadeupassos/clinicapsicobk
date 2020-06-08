import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConveniosPage } from './convenios.page';

const routes: Routes = [
  {
    path: '',
    component: ConveniosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConveniosPageRoutingModule {}
