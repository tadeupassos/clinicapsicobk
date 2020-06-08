import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuiasPageRoutingModule } from './guias-routing.module';

import { GuiasPage } from './guias.page';
import { FiltroDataPageModule } from '../filtro-data/filtro-data.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuiasPageRoutingModule,
    FiltroDataPageModule
  ],
  declarations: [GuiasPage]
})
export class GuiasPageModule {}
