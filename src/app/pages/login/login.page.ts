import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicosService } from 'src/app/services/servicos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public fGroup: FormGroup;

  public usuario = "";
  public senha = "";
  public mensagemErro = "";

  constructor(
    private fBuilder: FormBuilder, 
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router,
    private serv: ServicosService
  ) { 


  }  

  ngOnInit() {
    this.fGroup = this.fBuilder.group({
      'usuario': ['fernando.lira', Validators.compose([Validators.required])],
      'senha': ['', Validators.compose([Validators.required])]
    }); 
  }

  ionWillDidEnter(){

  }

  logar(){

    if(this.fGroup.get('usuario').value == "fernando.lira"){
      if(this.fGroup.get('senha').value == "insight20fernando"){
        window.localStorage.setItem("logado",this.fGroup.get('usuario').value);
        this.fGroup.get('senha').setValue('');
        this.serv.permissao = localStorage["logado"] == "fernando.lira";
        console.log("this.serv.permissao",this.serv.permissao);
        this.navCtrl.navigateForward('/menu');
      }else{
        this.presentToast("Senha incorreta.")
      }
    }else if(this.fGroup.get('usuario').value == "secretaria.insight"){
      if(this.fGroup.get('senha').value == "secretaria#20"){
        this.serv.permissao = localStorage["logado"] == "fernando.lira";
        window.localStorage.setItem("logado",this.fGroup.get('usuario').value);
        this.fGroup.get('senha').setValue('');
        this.navCtrl.navigateForward('/menu');
      }else{
        this.presentToast("Senha incorreta.")
      }
    }else{
      this.presentToast("Usuário incorreto.")
    }

  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2000
    });
    toast.present();
  }  

}
