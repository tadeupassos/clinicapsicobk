import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guia } from 'src/app/interfaces/guia';
import { Subscription } from 'rxjs';
import { GuiaService } from 'src/app/services/guia.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { FiltroDataPage } from '../filtro-data/filtro-data.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.page.html',
  styleUrls: ['./guias.page.scss'],
})
export class GuiasPage implements OnInit {

  private guia: Guia = {};
  public pacienteId: string = null;
  public convenioNome: string = null;
  private guiasubscription: Subscription;  
  public guias = new Array<Guia>();
  public todasGuias = new Array<Guia>();
  public mostrarBotaoCadastrar: boolean = false;
  private pacienteSubscription: Subscription;
  
  public mostrarResumo = false;
  public resumo = [];
  public dataDe = "";
  public dataAte = ""; 
  public filtroEscolhido = "";

  constructor(
    private activeRoute: ActivatedRoute,
    private guiaService: GuiaService,
    private pacienteService: PacienteService,
    private modalController: ModalController,
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
      this.guias = data.filter(f => { return f.convenio == this.convenioNome });
    });
  }

  loadGuiasPaciente(){

    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId).subscribe((data:any) => {
      this.convenioNome = data.nome;
    });

    this.guiasubscription = this.guiaService.getGuias().subscribe(data => {
      this.guias = data.filter((f: Guia) => { return f.pacienteId == this.pacienteId });
      this.todasGuias = this.guias;
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
        "dataDe" : this.dataAte,
        "dataAte" : this.dataAte
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

        this.dataDe = dataReturned.data.de;
        this.dataAte = dataReturned.data.ate;

        let partirDe = this.dataDe.split("/");
        let partirAte = this.dataAte.split("/");

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

}
