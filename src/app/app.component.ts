import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ServicosService } from './services/servicos.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private servicos: ServicosService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    //localStorage.removeItem("logado");
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.servicos.getCobranca().subscribe(c => {
        if(c.length > 0){
          this.servicos.cobranca = c[0];
        }
        console.log("this.servicos.cobranca",this.servicos.cobranca);
      })
    });

    this.servicos.pegarPsicor().subscribe(c => {
      this.servicos.Psicores = c; 
      console.log("this.servicos.psiCor",this.servicos.Psicores);
    });
  }
}
