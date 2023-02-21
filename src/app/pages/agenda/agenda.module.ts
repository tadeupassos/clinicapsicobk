import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaPageRoutingModule } from './agenda-routing.module';

import { AgendaPage } from './agenda.page';
import { AtendimentoPageModule } from '../atendimento/atendimento.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
    AtendimentoPageModule,
    ReactiveFormsModule
  ],
  declarations: [AgendaPage]
})
export class AgendaPageModule {}
