import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadconvenioPageRoutingModule } from './cadconvenio-routing.module';

import { CadconvenioPage } from './cadconvenio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadconvenioPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadconvenioPage]
})
export class CadconvenioPageModule {}
