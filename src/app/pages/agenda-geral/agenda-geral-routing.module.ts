import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaGeralPage } from './agenda-geral.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaGeralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaGeralPageRoutingModule {}
