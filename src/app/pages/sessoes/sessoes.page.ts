import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sessao } from 'src/app/interfaces/sessao';
import { Subscription } from 'rxjs';
import { SessaoService } from 'src/app/services/sessao.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ModalController } from '@ionic/angular';
import { CadsessaoParticularPage } from '../cadsessao-particular/cadsessao-particular.page';

@Component({
  selector: 'app-sessoes',
  templateUrl: './sessoes.page.html',
  styleUrls: ['./sessoes.page.scss'],
})
export class SessoesPage implements OnInit {

  public pacienteId: string = null;
  public sessaoSubscription: Subscription;  
  public pacienteSubscription: Subscription;  
  public sessoes = new Array<Sessao>();
  public nomePaciente = "";
  public atendimento = "";

  constructor(
    private activeRoute: ActivatedRoute,
    private sessaoService: SessaoService,
    private pacienteService: PacienteService,
    public modalController: ModalController
  ) { 
    this.pacienteId = this.activeRoute.snapshot.params['idPaciente'];

    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId).subscribe(p => {
      this.atendimento = p.atendimento;
      this.nomePaciente = p.nome;
    });

    this.sessaoSubscription = this.sessaoService.getSessoes(this.pacienteId).subscribe(data => {
      this.sessoes = data;
    
      this.sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

    });

  }

  ngOnInit() {

  }

  ngOndestroy(){
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
    this.sessaoSubscription.unsubscribe();
  }
  
  // async openModalCadSessaoParticular() {
  //   const modal = await this.modalController.create({
  //     component: CadsessaoParticularPage
  //   });
 
  //   modal.onDidDismiss().then((dataReturned:any) => {
      
  //   });
 
  //   return await modal.present();
  // }  

}
