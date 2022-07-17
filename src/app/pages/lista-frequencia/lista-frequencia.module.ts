import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaFrequenciaPageRoutingModule } from './lista-frequencia-routing.module';

import { ListaFrequenciaPage } from './lista-frequencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaFrequenciaPageRoutingModule
  ],
  declarations: [ListaFrequenciaPage]
})
export class ListaFrequenciaPageModule {}
