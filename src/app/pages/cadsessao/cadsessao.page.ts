import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sessao } from 'src/app/interfaces/sessao';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ServicosService } from 'src/app/services/servicos.service';
import { NavController } from '@ionic/angular';
import { SessaoService } from 'src/app/services/sessao.service';

@Component({
  selector: 'app-cadsessao',
  templateUrl: './cadsessao.page.html',
  styleUrls: ['./cadsessao.page.scss'],
})
export class CadsessaoPage implements OnInit {

  public fGroup: FormGroup;

  public sessao: Sessao = {};
  public sessaoId: string = null;
  public sessaoSubscription: Subscription;  
  public pacienteId = "";
  public nomePaciente = "";   
  public psicologo = "";
  public numeroGuia = "";

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private sessaoService: SessaoService,
    private servicos: ServicosService,
    private navCtrl: NavController
  ) { 
    this.sessaoId = this.activeRoute.snapshot.params['id'];
    console.log("this.sessaoId",this.sessaoId);

    if(this.sessaoId) this.loadSessao();

    this.fGroup = this.fBuilder.group({
      'dataSessao': [this.sessao.dataSessao, Validators.compose([Validators.required,])],
      'diaSemana': [this.sessao.diaSemana, Validators.compose([Validators.required,])],
      'horaSessao': [this.sessao.horaSessao, Validators.compose([Validators.required,])]
    });

  }

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
  }  

  loadSessao(){
    this.sessaoSubscription = this.sessaoService.getSessao(this.sessaoId).subscribe(data => {
      this.sessao = data;
      this.psicologo = this.sessao.psicologo;
      this.nomePaciente = this.sessao.nomePaciente;
      this.numeroGuia = this.sessao.numeroGuia;

      this.fGroup = this.fBuilder.group({
        'dataSessao': [this.sessao.dataSessao, Validators.compose([Validators.required,])],
        'diaSemana': [this.sessao.diaSemana, Validators.compose([Validators.required,])],
        'horaSessao': [this.sessao.horaSessao, Validators.compose([Validators.required,])]
      });  
    });
  }

  async salvarDados() {

    await this.servicos.presentLoading();
    this.sessao = this.fGroup.value;
    this.sessao.userId = "100";    
    console.log("this.sessao",this.sessao);
    
    try {
      await this.sessaoService.updateSessao(this.sessaoId, this.sessao);
      await this.servicos.loading.dismiss();
      this.navCtrl.navigateBack('/menu/sessoes/' + this.sessao.pacienteId);
    } catch (error) {
      this.servicos.presentToast('Erro ao tentar salvar');
      this.servicos.loading.dismiss();
    }
  }
  
  horaFormato(event){
    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.horaSessao) ? this.fGroup.value.horaSessao : "";

      if(data.length == 1){
        data = data + digito + ":";
        
        this.fGroup.get('horaSessao').setValue(data);
        return false
      }
    }
  }
  
  mascaraData(event) {
    let digito = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else{
      let data: string = (this.fGroup.value.dataSessao) ? this.fGroup.value.dataSessao : "";

      if(data.length == 1 || data.length == 4){
        data = data + digito + "/";
        
        this.fGroup.get('dataSessao').setValue(data);
        return false
      }
    }
  }
     

}
