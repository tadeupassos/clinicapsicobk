import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadsessaoParticularPage } from './cadsessao-particular.page';

const routes: Routes = [
  {
    path: '',
    component: CadsessaoParticularPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadsessaoParticularPageRoutingModule {}
