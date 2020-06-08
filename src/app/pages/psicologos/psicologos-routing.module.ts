import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PsicologosPage } from './psicologos.page';

const routes: Routes = [
  {
    path: '',
    component: PsicologosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PsicologosPageRoutingModule {}
