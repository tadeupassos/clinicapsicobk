import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/services/paciente.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sessao } from 'src/app/interfaces/sessao';
import { LoadingController, ModalController } from '@ionic/angular';
import { SessaoService } from 'src/app/services/sessao.service';

@Component({
  selector: 'app-cadsessao-particular',
  templateUrl: './cadsessao-particular.page.html',
  styleUrls: ['./cadsessao-particular.page.scss'],
})
export class CadsessaoParticularPage implements OnInit {

  @ViewChild('qtdeSessoes',{ static: true }) qtdeSessoes;

  public sessao: Sessao = {};
  public pacienteSubscription: Subscription;
  public pacienteId = "";
  public nomePaciente = "";   
  public psicologo = "";
  public crp = "";

  public loading: any;

  public fGroup: FormGroup;

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private loadingCtrl: LoadingController,
    private sessaoService: SessaoService,
    private modalController: ModalController,
    private router: Router
  ) {
    this.fGroup = this.fBuilder.group({
      'qtdeSessoes': ['', Validators.compose([Validators.required,])],
      'dataInicio': ['', Validators.compose([Validators.required,])],
      'dataFim': ['', Validators.compose([Validators.required,])],
      'diaSemana': ['', Validators.compose([Validators.required,])],
      'hora': ['', Validators.compose([Validators.required,])]
    }); 
   }

  ngOnInit() {
    this.pacienteSubscription = this.pacienteService.getPaciente(this.activeRoute.snapshot.params['id']).subscribe(p => {
      this.nomePaciente = p.nome;
      this.psicologo = p.psicologo;
      this.crp = p.crp;
      this.pacienteId = this.activeRoute.snapshot.params['id'];
    });
  }

  ngOndestroy() {
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
  } 



  dataInicioMascara(event){

    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.dataInicio) ? this.fGroup.value.dataInicio : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.fGroup.get('dataInicio').setValue(data);
        return false
      }
    }
  }

  dataFimMascara(event){

    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.dataFim) ? this.fGroup.value.dataFim : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.fGroup.get('dataFim').setValue(data);
        return false
      }
    }
  }
  
  horaFormato(event){
    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.hora) ? this.fGroup.value.hora : "";

      if(data.length == 1){
        data = data + digito + ":";
        
        this.fGroup.get('hora').setValue(data);
        return false
      }
    }
  }

  geraDataFim(){

    let data: string = (this.fGroup.value.dataInicio) ? this.fGroup.value.dataInicio : "";
    let qtdeSessoes: number = (this.fGroup.value.qtdeSessoes) ? parseInt(this.fGroup.value.qtdeSessoes) : 0;

    if(data){

      if(qtdeSessoes <= 0 ){
        this.fGroup.controls.qtdeSessoes.setErrors({ required: true });
        this.qtdeSessoes.setFocus();
      }else if(qtdeSessoes == 1){
        this.fGroup.get('dataFim').setValue(this.fGroup.value.dataInicio);
      }else{
        
        let dia = parseInt(this.fGroup.value.dataInicio.substr(0,2));
        let mes = parseInt(this.fGroup.value.dataInicio.substr(3,2));
        let ano = parseInt(this.fGroup.value.dataInicio.substr(6,4));
        let dataGerada  = new Date(ano,mes - 1,dia,0,0,0);
        //console.log("data Iniciio:", dataGerada);

        let subtrair = (qtdeSessoes == 1) ? 0 : 1;

        let qtdeDias = (qtdeSessoes - subtrair) * 7;
        dataGerada.setDate(dataGerada.getDate() + qtdeDias);
        //console.log("data fim:", dataGerada.toLocaleDateString());
        this.fGroup.get('dataFim').setValue(dataGerada.toLocaleDateString());
        //console.log("ultimaDataSessao:",dataGerada.toLocaleDateString());
      }
    }
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
    return this.loading.present();
  }
  
  async salvarDados() {

    await this.presentLoading();

    let dia = parseInt(this.fGroup.value.dataInicio.substr(0,2));
    let mes = parseInt(this.fGroup.value.dataInicio.substr(3,2));
    let ano = parseInt(this.fGroup.value.dataInicio.substr(6,4));
    let hora = parseInt(this.fGroup.value.hora.substr(0,2));
    let minuto = parseInt(this.fGroup.value.hora.substr(3,2));

    let dataGerada  = new Date(ano,mes - 1,dia,hora,minuto,0);

    let sessao: Sessao = {
      pacienteId: this.pacienteId,
      nomePaciente: this.nomePaciente,
      numeroGuia: "",
      psicologo: this.psicologo,
      crp: this.crp,
      dataSessao: dia.toString() + "/" + mes.toString() + "/" + ano.toString(),
      diaSemana: this.fGroup.value.diaSemana,
      dia: dia.toString(),
      mes: mes.toString(),
      ano: ano.toString(),
      horaSessao: this.fGroup.value.hora,
      frequencia: "",
      conteudo: "",
      evolucao: "",
      userId: "100"
    }

    try {
      await this.sessaoService.addSessao(sessao);
      await this.loading.dismiss();
      this.router.navigateByUrl('/menu/sessoes/' + this.pacienteId);

      for (let index = 2; index <= parseInt(this.fGroup.value.qtdeSessoes); index++) {

        let proximaData = dataGerada.setDate(dataGerada.getDate() + 7);
        let dia = new Date(proximaData).getDate();
        let mes = new Date(proximaData).getMonth() + 1;
        let ano = new Date(proximaData).getFullYear();

        let sessao: Sessao = {
          pacienteId: this.pacienteId,
          nomePaciente: this.nomePaciente,
          numeroGuia: "",
          psicologo: this.psicologo,
          crp: this.crp,
          dataSessao: dia + "/" + mes + "/" + ano,
          diaSemana: this.fGroup.value.diaSemana,
          dia: dia.toString(),
          mes: mes.toString(),
          ano: ano.toString(),       
          horaSessao: this.fGroup.value.hora,
          frequencia: "",
          conteudo: "",
          evolucao: "",
          userId: "100"
        }
  
        try {
          await this.sessaoService.addSessao(sessao);
          //await this.modalController.dismiss();
          //console.log("sessao " + index + ":", JSON.stringify(sessao));
        } catch (error) {
          console.log("addSessao(sessao) " + index + ":",error);
        }
      }
    } catch (error) {
      console.log("addSessao(sessao) 1:",error);
    }
  }  

  // async closeModal() {
  //   await this.modalController.dismiss();
  // }

}
