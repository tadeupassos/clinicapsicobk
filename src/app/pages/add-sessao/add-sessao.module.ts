import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddSessaoPageRoutingModule } from './add-sessao-routing.module';
import { AddSessaoPage } from './add-sessao.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSessaoPageRoutingModule,
    BrMaskerModule,
    ReactiveFormsModule
  ],
  declarations: [AddSessaoPage]
})
export class AddSessaoPageModule {}
