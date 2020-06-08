import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessoesPage } from './sessoes.page';

const routes: Routes = [
  {
    path: '',
    component: SessoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessoesPageRoutingModule {}
