import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  public loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCrtl: ToastController
  ) {
    
  }

  public async presentLoading(){
    this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
    return this.loading.present();
  }

  public async presentToast(message: string){
    const toast = await this.toastCrtl.create({ message,  duration: 2000 });
    toast.present();
  }  

  // public formatarValor(event, dados) {

  //   let digito = event.key;

  //   if(dados.length > 8){
  //     return false;
  //   }else if(digito == ","){
      
  //   }else if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
  //     return false;
  //   }

  //   return dados;
  // }  


}
