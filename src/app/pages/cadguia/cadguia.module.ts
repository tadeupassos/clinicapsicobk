import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadguiaPageRoutingModule } from './cadguia-routing.module';

import { CadguiaPage } from './cadguia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadguiaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadguiaPage]
})
export class CadguiaPageModule {}
