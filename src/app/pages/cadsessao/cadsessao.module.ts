import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadsessaoPageRoutingModule } from './cadsessao-routing.module';

import { CadsessaoPage } from './cadsessao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadsessaoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadsessaoPage]
})
export class CadsessaoPageModule {}
