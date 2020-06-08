import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConveniosPageRoutingModule } from './convenios-routing.module';

import { ConveniosPage } from './convenios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConveniosPageRoutingModule
  ],
  declarations: [ConveniosPage]
})
export class ConveniosPageModule {}
