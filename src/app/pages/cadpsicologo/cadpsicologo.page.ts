import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ServicosService } from 'src/app/services/servicos.service';
import { NavController } from '@ionic/angular';
import { PsicologoService } from 'src/app/services/psicologo.service';

@Component({
  selector: 'app-cadpsicologo',
  templateUrl: './cadpsicologo.page.html',
  styleUrls: ['./cadpsicologo.page.scss'],
})
export class CadpsicologoPage implements OnInit {

  public fGroup: FormGroup;

  private psicologo: Psicologo = {};
  private psicologoId: string = null;
  private psicologoSubscription: Subscription;     

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private psicologoService: PsicologoService,
    private servicos: ServicosService,
    private navCtrl: NavController
  ) { 
    this.psicologoId = this.activeRoute.snapshot.params['id'];

    if(this.psicologoId) this.loadPsicologo();

    this.fGroup = this.fBuilder.group({
      'nome': [this.psicologo.nome, Validators.compose([Validators.required,])],
      'email': [this.psicologo.email, Validators.compose([Validators.required,])],
      'senha': [this.psicologo.senha, Validators.compose([Validators.required,])],
      'celular': [this.psicologo.celular, Validators.compose([Validators.required,])],
      'crp': [this.psicologo.crp, Validators.compose([Validators.required,])],
      'desativar': [this.psicologo.desativar],
    });    
  }

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.psicologoSubscription) this.psicologoSubscription.unsubscribe();
  }

  loadPsicologo(){
    this.psicologoSubscription = this.psicologoService.getPsicologo(this.psicologoId).subscribe(data => {
      this.psicologo = data;

      this.fGroup = this.fBuilder.group({
        'nome': [this.psicologo.nome, Validators.compose([Validators.required,])],
        'email': [this.psicologo.email, Validators.compose([Validators.required,])],
        'senha': [this.psicologo.senha, Validators.compose([Validators.required,])],
        'celular': [this.psicologo.celular, Validators.compose([Validators.required,])],
        'crp': [this.psicologo.crp, Validators.compose([Validators.required,])],
        'desativar': [this.psicologo.desativar],
      });  
    });
  }
  
  async salvarDados() {

    await this.servicos.presentLoading();
    this.psicologo = this.fGroup.value;
    this.psicologo.userId = "100";    

    if(this.psicologoId){
      try {
        await this.psicologoService.updatePsicologo(this.psicologoId, this.psicologo);
        await this.servicos.loading.dismiss();

        this.navCtrl.navigateBack('/menu/psicologos');
      } catch (error) {
        this.servicos.presentToast('Erro ao tentar salvar');
        this.servicos.loading.dismiss();
      }
    }else{
      try {
        await this.psicologoService.addPsicologo(this.psicologo);
        await this.servicos.loading.dismiss();

        this.navCtrl.navigateBack('/menu/psicologos');
      } catch (error) {
        this.servicos.presentToast('Erro ao tentar salvar');
        this.servicos.loading.dismiss();
      }
    }
  }

  formatoCelular(event){

    let numero = (this.fGroup.value.celular) ? this.fGroup.value.celular : "";
    let digito: string = event.key;

    if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }else if(numero.length == 0){
      numero = numero + "(" + digito;
      this.fGroup.get("celular").setValue(numero);
      return false;
    }else if(numero.length == 3){
      numero = numero + ") " + digito;
      this.fGroup.get("celular").setValue(numero);
      return false;
    }else if(numero.length == 10){
      numero = numero + "-" + digito;
      this.fGroup.get("celular").setValue(numero);
      return false;
    }
  }  

}
