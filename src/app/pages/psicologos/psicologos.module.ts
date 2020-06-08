import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PsicologosPageRoutingModule } from './psicologos-routing.module';

import { PsicologosPage } from './psicologos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PsicologosPageRoutingModule
  ],
  declarations: [PsicologosPage]
})
export class PsicologosPageModule {}
