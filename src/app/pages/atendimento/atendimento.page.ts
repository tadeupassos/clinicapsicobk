import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Paciente } from 'src/app/interfaces/paciente';
import { Sessao } from 'src/app/interfaces/sessao';
import { PacienteService } from 'src/app/services/paciente.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { SessaoService } from 'src/app/services/sessao.service';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.page.html',
  styleUrls: ['./atendimento.page.scss']
})
export class AtendimentoPage implements OnInit {

  public fGroup: FormGroup;
  public sessao: Sessao = {};
  public sessaoId: string = null;
  public sessaoSubscription: Subscription;  
  private paciente: Paciente = {};
  private pacienteSubscription: Subscription;  
  public loading: any;

  constructor(
    private fBuilder: FormBuilder,
    private modalController: ModalController,
    private navParams: NavParams,
    private sessaoService: SessaoService,
    private pacienteService: PacienteService,
    private serv: ServicosService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
  ) {

    this.fGroup = this.fBuilder.group({
      'frequencia': ['', Validators.compose([Validators.required])],
    });

    this.sessaoId = this.navParams.data.id;
    this.sessaoSubscription = this.sessaoService.getSessao(this.sessaoId).subscribe(data => {
      this.sessao = data;
      console.log("this.sessao",this.sessao);

      if(this.sessao){
        this.fGroup = this.fBuilder.group({
          'frequencia': [this.sessao.frequencia, Validators.compose([Validators.required])],
        });

        this.pacienteSubscription = this.pacienteService.getPaciente(this.sessao.pacienteId).subscribe(data => {
          this.paciente = data;
        });
      }
    });
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss("nada");
  }

  async salvarDados(){
    this.sessao.frequencia = this.fGroup.value.frequencia;
    this.sessao.userId = "100";  
    await this.modalController.dismiss({ id: this.sessaoId, sessao: this.sessao });
  }
  
  async excluir(){
    const alert = await this.alertController.create({
      header: 'Tem certeza que deseja excluir!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: async () => {
            await this.presentLoading();
            this.sessaoService.deleteSessao(this.sessaoId);
            await this.loading.dismiss();
            this.closeModal();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
    return this.loading.present();
  }

}
