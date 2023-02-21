import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaGeralPageRoutingModule } from './agenda-geral-routing.module';

import { AgendaGeralPage } from './agenda-geral.page';
import { AtendimentoPageModule } from '../atendimento/atendimento.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //AtendimentoPageModule,
    AgendaGeralPageRoutingModule
  ],
  declarations: [AgendaGeralPage],
})
export class AgendaGeralPageModule {}
