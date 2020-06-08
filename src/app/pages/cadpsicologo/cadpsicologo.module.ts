import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadpsicologoPageRoutingModule } from './cadpsicologo-routing.module';

import { CadpsicologoPage } from './cadpsicologo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadpsicologoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadpsicologoPage]
})
export class CadpsicologoPageModule {}
