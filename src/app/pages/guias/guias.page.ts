import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guia } from 'src/app/interfaces/guia';
import { Subscription } from 'rxjs';
import { GuiaService } from 'src/app/services/guia.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { FiltroDataPage } from '../filtro-data/filtro-data.page';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage implements OnInit {

  guia: Guia = {};
  pacienteId: string = null;
  convenioNome: string = null;
  guiasubscription: Subscription;  
  guias = new Array<Guia>();
  todasGuias = new Array<Guia>();
  mostrarBotaoCadastrar: boolean = false;
  pacienteSubscription: Subscription;
  
  mostrarResumo = false;
  resumo = [];
  dataInicio = "";
  dataFim = ""; 
  filtroEscolhido = "";

  constructor(
    private activeRoute: ActivatedRoute,
    private guiaService: GuiaService,
    private pacienteService: PacienteService,
    private modalController: ModalController,
    public toastController: ToastController
  ) {

    this.mostrarResumo = false;

    if(this.activeRoute.snapshot.params['parametro'] == "convenio"){
      this.convenioNome = this.activeRoute.snapshot.params['dados'];
      this.loadGuiasConvenio();
      this.filtrar();
    }else{
      this.pacienteId = this.activeRoute.snapshot.params['dados'];
      this.mostrarBotaoCadastrar = true;
      this.loadGuiasPaciente();
      this.filtrar();
    }
  }

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();

    this.guiasubscription.unsubscribe();
  }  

  loadGuiasConvenio(){
    this.guiasubscription = this.guiaService.getGuias().subscribe(data => {
      this.todasGuias = data.filter(f => { 
        return f.convenio == this.convenioNome 
      }).sort((a,b) => {
        let partA = a.dataInicio.split("/");
        let partB = b.dataInicio.split("/");
        let dtGuiaA = new Date(partA[2] + "-" + partA[1] + "-" + partA[0]);
        let dtGuiaB = new Date(partB[2] + "-" + partB[1] + "-" + partB[0]) 
        return dtGuiaA < dtGuiaB ? -1 : 1 
      });
      this.guias = this.todasGuias;
    });
  }

  loadGuiasPaciente(){

    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId)
    .subscribe((data:any) => {
      this.convenioNome = data.nome;
    });

    this.guiasubscription = this.guiaService.getGuias().subscribe(data => {
      this.todasGuias = data.filter((f: Guia) => { 
        return f.pacienteId == this.pacienteId 
      }).sort((a,b) => {
        let partA = a.dataInicio.split("/");
        let partB = b.dataInicio.split("/");
        let dtGuiaA = new Date(partA[2] + "-" + partA[1] + "-" + partA[0]);
        let dtGuiaB = new Date(partB[2] + "-" + partB[1] + "-" + partB[0]) 
        return dtGuiaA < dtGuiaB ? -1 : 1 
      });

      this.guias = this.todasGuias;
    });
  }  
  
  filtrar(){
    this.resumo = [
      { psicologo: "Tadeu Pereira Passos", qtde: 4 },
      { psicologo: "José Pereira Silva", qtde: 4 },
      { psicologo: "João Moreira", qtde: 4 },
      { psicologo: "Ana Sofia", qtde: 4 }
    ];
  }  

  async openModalfiltrar() {
    const modal = await this.modalController.create({
      component: FiltroDataPage,
      cssClass: "tamanho-modal-filtro",
      componentProps: { 
        "dataDe" : this.dataInicio,
        "dataAte" : this.dataFim
      }
    });
  
    modal.onDidDismiss().then((dataReturned:any) => {
      console.log("dataReturned",dataReturned);
      if (dataReturned.role == "backdrop" || dataReturned.data.status == "nada") {
        console.log("nada");
        if(dataReturned.data.de != ""){
          this.filtroEscolhido = "";
        }else{
          this.filtroEscolhido = ": " + dataReturned.data.de + " à " + dataReturned.data.ate;
        }
      }else{

        this.filtroEscolhido = ": " + dataReturned.data.de + " à " + dataReturned.data.ate;

        console.log("dataReturned.data.de",dataReturned.data.de);
        console.log("dataReturned.data.ate",dataReturned.data.ate);

        this.dataInicio = dataReturned.data.de;
        this.dataFim = dataReturned.data.ate;

        let partirDe = this.dataInicio.split("/");
        let partirAte = this.dataFim.split("/");

        this.guias = this.guias.filter(f => {

          let partDtGuia = f.dataInicio.split("/");

          return new Date(partDtGuia[2] + "-" + partDtGuia[1] + "-" + partDtGuia[0]) >= new Date(partirDe[2] + "-" + partirDe[1] + "-" + partirDe[0]) &&
                 new Date(partDtGuia[2] + "-" + partDtGuia[1] + "-" + partDtGuia[0]) <= new Date(partirAte[2] + "-" + partirAte[1]  + "-" +  partirAte[0])

        }).sort((a,b) => {

          let partA = a.dataInicio.split("/");
          let partB = b.dataInicio.split("/");

          return new Date(partA[2] + "-" + partA[1] + "-" + partA[0]) > new Date(partB[2] + "-" + partB[1] + "-" + partB[0]) ? -1 : 1 
        });
      }
    });
 
    return await modal.present();
  } 

  async filtrarPeriodo(){

    let dataInicioPronta: any;
    let dataFimPronta: any;
    console.log("this.dataInicio", this.dataInicio);
    console.log("this.dataFim", this.dataFim);
    
    if(this.dataInicio == "" && this.dataFim == ""){
      const toast = await this.toastController.create({
        message: 'Campos Data Início e Data Fim estão vazios.',
        duration: 3000,
        position: "middle"
      });
      toast.present();
    }else{

      if(this.dataInicio != ""){
        console.log("this.dataInicio", this.dataInicio);
        let partirA = this.dataInicio.split("/");
        if(partirA.length < 3){
          const toast = await this.toastController.create({
            message: 'Data Início está incompleta.',
            duration: 3000,
            position: "top"
          });
          toast.present();
        }else{
          console.log("partirA",partirA);
          dataInicioPronta = new Date(Number(partirA[2]), Number(partirA[1]) - 1, Number(partirA[0]));
          console.log("dataInicioPronta", dataInicioPronta);
        }
      }
      
      if(this.dataFim != ""){
        console.log("this.dataFim", this.dataFim);
        let partirB = this.dataFim.split("/");
        console.log("partirB",partirB);
        if(partirB.length < 3){
          const toast = await this.toastController.create({
            message: 'Data Fim está incompleta.',
            duration: 3000,
            position: "top"
          });
          toast.present();
        }else{
          dataFimPronta = new Date(Number(partirB[2]), Number(partirB[1]) - 1, Number(partirB[0]));
          console.log("dataFimPronta", dataFimPronta);
        }
      }

      this.guias = this.todasGuias.filter(f => {
        let [dia, mes, ano] = f.dataInicio.split("/");
        let dtGuia = new Date(Number(ano), Number(mes) - 1, Number(dia));
        if(dataInicioPronta && dataFimPronta){
          return dtGuia > dataInicioPronta && dtGuia < dataFimPronta
        }else if(dataInicioPronta){
          return dtGuia > dataInicioPronta 
        }else if(dataFimPronta){
          return dtGuia < dataFimPronta 
        }
      });
    }
  }

}
