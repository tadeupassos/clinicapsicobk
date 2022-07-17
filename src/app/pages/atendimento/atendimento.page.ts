import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Paciente } from 'src/app/interfaces/paciente';
import { Sessao } from 'src/app/interfaces/sessao';
import { PacienteService } from 'src/app/services/paciente.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { SessaoService } from 'src/app/services/sessao.service';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.page.html',
  styleUrls: ['./atendimento.page.scss'],
})
export class AtendimentoPage implements OnInit {

  public fGroup: FormGroup;
  public sessao: Sessao = {};
  public sessaoId: string = null;
  public sessaoSubscription: Subscription;  
  private paciente: Paciente = {};
  private pacienteSubscription: Subscription;  

  constructor(
    private fBuilder: FormBuilder,
    private modalController: ModalController,
    private navParams: NavParams,
    private sessaoService: SessaoService,
    private pacienteService: PacienteService,
    private serv: ServicosService
  ) {

    this.fGroup = this.fBuilder.group({
      'frequencia': [this.sessao.frequencia, Validators.compose([Validators.required])],
    });

    this.sessaoId = this.navParams.data.id;
    this.sessaoSubscription = this.sessaoService.getSessao(this.sessaoId).subscribe(data => {
      this.sessao = data;
      console.log("this.sessao",this.sessao);

      this.pacienteSubscription = this.pacienteService.getPaciente(this.sessao.pacienteId).subscribe(data => {
        this.paciente = data;
      });

    });
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async salvarDados(){
    this.serv.presentLoading();

    this.sessao.frequencia = this.fGroup.value.frequencia;
    this.sessao.userId = "100";  

    try {
      await this.sessaoService.updateSessao(this.sessaoId, this.sessao);
      this.serv.loading.dismiss();
      await this.modalController.dismiss();
    }catch(error) {
      this.serv.loading.dismiss();
    }
  }

}
