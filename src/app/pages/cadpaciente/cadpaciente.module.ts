import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadpacientePageRoutingModule } from './cadpaciente-routing.module';

import { CadpacientePage } from './cadpaciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadpacientePageRoutingModule, 
    ReactiveFormsModule
  ],
  declarations: [CadpacientePage]
})
export class CadpacientePageModule {}
