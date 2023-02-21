import { Component, OnInit } from '@angular/core';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { Subscription } from 'rxjs';
import { PsicologoService } from 'src/app/services/psicologo.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { ActivatedRoute } from '@angular/router';
import { Sessao } from 'src/app/interfaces/sessao';
import { SessaoService } from 'src/app/services/sessao.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AtendimentoPage } from '../atendimento/atendimento.page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage {

  private psicologo: Psicologo = {};
  private psicologoId: string = null;
  private psicologoSubscription: Subscription;  
  public sessaoAgendadaSubscription: Subscription;  
  public sessaoFinalizadaSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public agrupadoAgenda = [];
  public agrupadoFinalizada = [];
  segmentModel = "agenda";
  mesSelecionando = (new Date().getMonth() + 1).toString();
  anoSelecionado = new Date().getFullYear().toString();

  public fGroup: FormGroup;

  constructor(
    private psicologoService: PsicologoService,
    private activeRoute: ActivatedRoute,
    private servicos: ServicosService,
    private sessaoService: SessaoService,
    private alertController: AlertController,
    private modalController: ModalController,
    private fBuilder: FormBuilder,
  ) {

    this.fGroup = this.fBuilder.group({
      'mes': [this.mesSelecionando, Validators.compose([Validators.required])],
      'ano': [this.anoSelecionado, Validators.compose([Validators.required])],
    });

    this.fGroup.get("mes").valueChanges.subscribe((mes:string) => {
      this.mesSelecionando = mes;
      this.getSessoesFinalizadas(mes, this.anoSelecionado);
    });

    this.fGroup.get("ano").valueChanges.subscribe((ano:string) => {
      console.log("ano",ano);
      this.anoSelecionado = ano;
      this.getSessoesFinalizadas(this.mesSelecionando, ano);
    });

    this.psicologoId = this.activeRoute.snapshot.params['id'];

    this.psicologoSubscription = this.psicologoService.getPsicologo(this.psicologoId).subscribe(data => {
      this.psicologo = data;
      console.log("this.psicologo",this.psicologo);
      localStorage.setItem("nomePsicologo",this.psicologo.nome);
      localStorage.setItem("crp",this.psicologo.crp);
      this.carregarSessoesAgendadas();
      this.getSessoesFinalizadas(this.mesSelecionando, this.anoSelecionado);
    });

   }

   carregarSessoesAgendadas(){
    this.sessaoAgendadaSubscription = this.sessaoService.getSessoesAgendadas(this.psicologo.crp.toString())
    .subscribe((data: Array<Sessao>) => {
      this.sessoes = data;
      console.log("this.sessoes",this.sessoes);

      this.sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

      let grupo = this.sessoes.reduce((r, a) => {
        r[a.dataSessao] = [...r[a.dataSessao] || [], a];
        return r;
       }, {});

      this.agrupadoAgenda = Object.entries(grupo);

    })
  }

  ngOndestroy() {
    if(this.psicologoSubscription) this.psicologoSubscription.unsubscribe();
    if(this.sessaoAgendadaSubscription) this.sessaoAgendadaSubscription.unsubscribe();
    if(this.sessaoFinalizadaSubscription) this.sessaoFinalizadaSubscription.unsubscribe();
  }

  excluir(id:string){
    this.presentAlertConfirm(id)
  }

  async presentAlertConfirm(id:string) {
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
          handler: () => {
            console.log("id sessao",id);
            this.sessaoService.deleteSessao(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async setarAtendimento(id:any) {
    const modal = await this.modalController.create({
      component: AtendimentoPage,
      backdropDismiss: false,
      componentProps : { id }
    });

    return await modal.present();
  }

  getSessoesFinalizadas(mes:string, ano:string){
    mes = mes.length > 1 ? mes : "0" + mes;

    this.sessaoFinalizadaSubscription = this.sessaoService.getSessoesFinalizadas(this.psicologo.crp.toString(), mes, ano)
    .subscribe((data: Array<Sessao>) => {
      this.sessoes = data;
      console.log("this.sessoes",this.sessoes);

      this.sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

      let grupo = this.sessoes.reduce((r, a) => {
        r[a.dataSessao] = [...r[a.dataSessao] || [], a];
        return r;
       }, {});

      this.agrupadoFinalizada = Object.entries(grupo);

    })
  }

  teste(e){
    console.log("e",e);
  }

}
