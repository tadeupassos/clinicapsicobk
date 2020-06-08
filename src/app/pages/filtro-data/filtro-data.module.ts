import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltroDataPageRoutingModule } from './filtro-data-routing.module';

import { FiltroDataPage } from './filtro-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltroDataPageRoutingModule
  ],
  declarations: [FiltroDataPage]
})
export class FiltroDataPageModule {}
