import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProntuarioPage } from './prontuario.page';

const routes: Routes = [
  {
    path: '',
    component: ProntuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProntuarioPageRoutingModule {}
