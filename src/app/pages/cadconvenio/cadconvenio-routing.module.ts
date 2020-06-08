import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadconvenioPage } from './cadconvenio.page';

const routes: Routes = [
  {
    path: '',
    component: CadconvenioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadconvenioPageRoutingModule {}
