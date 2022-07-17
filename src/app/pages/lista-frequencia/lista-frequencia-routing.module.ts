import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaFrequenciaPage } from './lista-frequencia.page';

const routes: Routes = [
  {
    path: '',
    component: ListaFrequenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaFrequenciaPageRoutingModule {}
