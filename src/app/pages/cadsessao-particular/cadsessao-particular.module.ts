import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadsessaoParticularPageRoutingModule } from './cadsessao-particular-routing.module';

import { CadsessaoParticularPage } from './cadsessao-particular.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadsessaoParticularPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadsessaoParticularPage]
})
export class CadsessaoParticularPageModule {}
