import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadpacientePage } from './cadpaciente.page';

const routes: Routes = [
  {
    path: '',
    component: CadpacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadpacientePageRoutingModule {}
