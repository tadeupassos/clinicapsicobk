import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltroDataPage } from './filtro-data.page';

const routes: Routes = [
  {
    path: '',
    component: FiltroDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltroDataPageRoutingModule {}
