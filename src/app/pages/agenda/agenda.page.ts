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

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage {

  private psicologo: Psicologo = {};
  private psicologoId: string = null;
  private psicologoSubscription: Subscription;  
  public sessaoSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public agrupadoData = [];

  constructor(
    private psicologoService: PsicologoService,
    private activeRoute: ActivatedRoute,
    private servicos: ServicosService,
    private sessaoService: SessaoService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.psicologoId = this.activeRoute.snapshot.params['id'];

    this.psicologoSubscription = this.psicologoService.getPsicologo(this.psicologoId).subscribe(data => {
      this.psicologo = data;
      console.log("this.psicologo",this.psicologo);
      localStorage.setItem("nomePsicologo",this.psicologo.nome);
      localStorage.setItem("crp",this.psicologo.crp);
      this.carregarSessoesAgendadas();

    });

   }

   carregarSessoesAgendadas(){
    this.sessaoSubscription = this.sessaoService.getSessoesAgendadas(this.psicologo.crp.toString())
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

      this.agrupadoData = Object.entries(grupo);

    })
  }

  ngOndestroy() {
    if(this.psicologoSubscription) this.psicologoSubscription.unsubscribe();
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
    console.log("setarAtendimento")
    const modal = await this.modalController.create({
      component: AtendimentoPage,
      backdropDismiss: false,
      componentProps : { id }
    });

    return await modal.present();
  }

}
