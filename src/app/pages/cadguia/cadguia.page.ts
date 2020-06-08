import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Guia } from 'src/app/interfaces/guia';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiaService } from 'src/app/services/guia.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { Paciente } from 'src/app/interfaces/paciente';
import { SessaoService } from 'src/app/services/sessao.service';
import { Sessao } from 'src/app/interfaces/sessao';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cadguia',
  templateUrl: './cadguia.page.html',
  styleUrls: ['./cadguia.page.scss'],
})
export class CadguiaPage implements OnInit {

  @ViewChild('qtdeSessoes',{ static: true }) qtdeSessoes;

  public fGroup: FormGroup;

  public loading: any;

  private guia: Guia = {};
  private guiaId: string = null;
  private guiaSubscription: Subscription;    
  private pacienteSubscription: Subscription;
  private pacienteId: string = null;
  private paciente: Paciente = {};
  public nomePaciente: string = null;


  constructor(private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private guiaService: GuiaService,
    private servicos: ServicosService,
    private pacienteService: PacienteService,
    private sessaoService: SessaoService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { 

    if(this.activeRoute.snapshot.params['parametro'] == "paciente"){
      this.pacienteId = this.activeRoute.snapshot.params['dados'];
      this.loadPaciente();
    }else{
      this.guiaId = this.activeRoute.snapshot.params['dados'];
      this.loadGuia();
    }  
    
    this.fGroup = this.fBuilder.group({
      'crmMedico': [''],
      'numeroGuia': [''],
      'convenio': [''],
      'qtdeSessoes': ['', Validators.compose([Validators.required,])],
      'dataInicio': ['', Validators.compose([Validators.required,])],
      'dataFim': [''],
      'diaSemana': ['', Validators.compose([Validators.required,])],
      'hora': ['', Validators.compose([Validators.required,])]
    });  

  }

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.guiaSubscription) this.guiaSubscription.unsubscribe();
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
  }  

  loadGuia(){
    this.guiaSubscription = this.guiaService.getGuia(this.guiaId).subscribe(data => {
      this.guia = data;
      this.nomePaciente = this.guia.nomePaciete;
      this.pacienteId = this.guia.pacienteId;

      this.fGroup = this.fBuilder.group({
        'crmMedico': [this.guia.crmMedico],
        'numeroGuia': [this.guia.numeroGuia],
        'convenio': [this.guia.convenio],
        'qtdeSessoes': [this.guia.qtdeSessoes, Validators.compose([Validators.required,])],
        'dataInicio': [this.guia.dataInicio, Validators.compose([Validators.required,])],
        'dataFim': [this.guia.dataFim],
        'diaSemana': [this.guia.diaSemana, Validators.compose([Validators.required,])],
        'hora': [this.guia.hora, Validators.compose([Validators.required,])]
      });        

    });
  }
  
  loadPaciente(){
    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId).subscribe(data => {
      this.paciente = data;
      this.nomePaciente = this.paciente.nome;

      this.fGroup = this.fBuilder.group({
        'crmMedico': [''],
        'numeroGuia': [''],
        'convenio': [this.paciente.convenio],
        'qtdeSessoes': ['', Validators.compose([Validators.required,])],
        'dataInicio': ['', Validators.compose([Validators.required,])],
        'dataFim': [''],
        'diaSemana': ['', Validators.compose([Validators.required,])],
        'hora': ['', Validators.compose([Validators.required,])]
      });  

    });
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

  async salvarDados() {

    await this.presentLoading();
    this.guia = this.fGroup.value;
    this.guia.userId = "100";
    
    if(this.guiaId){
      try {
        await this.guiaService.updateGuia(this.guiaId, this.guia);
        await this.loading.dismiss();

        this.router.navigateByUrl('/menu/guias' + '/paciente/' + this.pacienteId);
      } catch (error) {
        this.servicos.presentToast('Erro ao tentar salvar');
        await this.loading.dismiss();
      }
    }else{
      try {
        this.guia.pacienteId = this.pacienteId;
        this.guia.nomePaciete = this.paciente.nome;
        this.guia.nomePsicologo = this.paciente.psicologo;
       
        this.guiaService.addGuia(this.guia);
        this.gerandoSessoes();
        await this.loading.dismiss();

        this.router.navigateByUrl('/menu/guias' + '/paciente/' + this.pacienteId);
      } catch (error) {
        console.log("erro ao gravar:",error);
        this.servicos.presentToast('Erro ao tentar salvar');
        await this.loading.dismiss();
      }
    }
  }
  
  async gerandoSessoes() {

    let dia = parseInt(this.guia.dataInicio.substr(0,2));
    let mes = parseInt(this.guia.dataInicio.substr(3,2));
    let ano = parseInt(this.guia.dataInicio.substr(6,4));
    let hora = parseInt(this.guia.hora.substr(0,2));
    let minuto = parseInt(this.guia.hora.substr(3,2));

    let dataGerada  = new Date(ano,mes - 1,dia,hora,minuto,0);

    let sessao: Sessao = {
      pacienteId: this.pacienteId,
      nomePaciente: this.nomePaciente,
      numeroGuia: this.guia.numeroGuia,
      psicologo: this.paciente.psicologo,
      crp: this.paciente.crp,
      dataSessao: dia.toString() + "/" + mes.toString() + "/" + ano.toString(),
      diaSemana: this.guia.diaSemana,
      dia: dia.toString(),
      mes: mes.toString(),
      ano: ano.toString(),
      horaSessao: this.guia.hora,
      frequencia: "",
      conteudo: "",
      evolucao: "",
      userId: "100"
    }

    try {
      await this.sessaoService.addSessao(sessao);

      //console.log("sessao 1:", JSON.stringify(sessao));

      for (let index = 2; index <= parseInt(this.guia.qtdeSessoes); index++) {

        let proximaData = dataGerada.setDate(dataGerada.getDate() + 7);
  
        //console.log("dataGerada.setDate:",dataGerada);
  
        let dia = new Date(proximaData).getDate();
        let mes = new Date(proximaData).getMonth() + 1;
        let ano = new Date(proximaData).getFullYear();

        let sessao: Sessao = {
          pacienteId: this.pacienteId,
          nomePaciente: this.nomePaciente,
          numeroGuia: this.guia.numeroGuia,
          psicologo: this.paciente.psicologo,
          crp: this.paciente.crp,
          dataSessao: dia + "/" + mes + "/" + ano,
          diaSemana: this.guia.diaSemana,
          dia: dia.toString(),
          mes: mes.toString(),
          ano: ano.toString(),       
          horaSessao: this.guia.hora,
          frequencia: "",
          conteudo: "",
          evolucao: "",
          userId: "100"
        }
  
        try {
          await this.sessaoService.addSessao(sessao);
          //console.log("sessao " + index + ":", JSON.stringify(sessao));
        } catch (error) {
          console.log("addSessao(sessao) " + index + ":",error);
        }
      }
    } catch (error) {
      console.log("addSessao(sessao) 1:",error);
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

}
