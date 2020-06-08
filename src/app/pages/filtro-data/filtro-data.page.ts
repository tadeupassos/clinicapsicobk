import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-filtro-data',
  templateUrl: './filtro-data.page.html',
  styleUrls: ['./filtro-data.page.scss'],
})
export class FiltroDataPage implements OnInit {

  public dataDe = "";
  public dataAte = ""; 

  // dataInicioEscolhida = "";
  // dataFimEscolhida = "";

  dtInicioVazio = false;
  dtFimVazio = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    if(this.navParams.data.dataDe){
      //let partirDataDe = this.navParams.data.dataDe.split("/");
      //let partirDataAte = this.navParams.data.dataAte.split("/");
      // this.dataDe[partirDataDe[2],partirDataDe[1],partirDataDe[0]].join("-"); 
      // this.dataAte = [partirDataAte[2],partirDataAte[1],partirDataAte[0]].join("-");
      this.dataDe = this.navParams.data.dataDe;
      this.dataAte = this.navParams.data.dataAte;
    }

  }

  dataDeMascara(event){

    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.dataDe) ? this.dataDe : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.dataDe = data;
        return false
      }
    }
  }
  
  dataAteMascara(event){

    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.dataAte) ? this.dataAte : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.dataAte = data;
        return false
      }
    }
  }

  async closeModal() {
    await this.modalController.dismiss({ status: "nada", dataDe: this.dataDe, dataAte: this.dataAte });
  }

  async filtrar() {

    this.dtInicioVazio = (this.dataDe == "");
    this.dtFimVazio = (this.dataAte == ""); 

    if(!this.dtInicioVazio && !this.dtFimVazio){
      let dados = {
        de: this.dataDe,
        ate: this.dataAte,
        status: "filtro"
      }
  
      await this.modalController.dismiss(dados);
    }
  }
 
  dtFimVazioVerifica(){
    if(this.dataAte){
      this.dtFimVazio = false;
    }
  }  

}
