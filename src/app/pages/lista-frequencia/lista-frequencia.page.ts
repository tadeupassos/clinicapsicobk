import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators';
import { FrequenciaService } from 'src/app/services/frequencia.service';
import { ServicosService } from 'src/app/services/servicos.service';

@Component({
  selector: 'app-lista-frequencia',
  templateUrl: './lista-frequencia.page.html',
  styleUrls: ['./lista-frequencia.page.scss'],
})
export class ListaFrequenciaPage implements OnInit {

  frequencias = [];
  frequenciaSubscription: Subscription;

  constructor(
    private frequenciaServ: FrequenciaService,
    private modalController: ModalController,
    private serv: ServicosService
  ) { 
    this.frequenciaSubscription = this.frequenciaServ.getFrequencias().pipe(
      take(1)
    ).subscribe((frequencias:any) => {
      this.frequencias = frequencias.sort((a,b) => a.tipo < b.tipo ? -1 : 1);
      console.log("this.frequencias", this.frequencias);
    });
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async setaRepasse(f:any){
    if(f.tipo != "Reposição"){
      f.repasse = f.repasse == 'S' ? 'N' : 'S';
      this.serv.presentLoading();
      await this.frequenciaServ.updateFrequencia(f.id,f);
      this.serv.loading.dismiss();
    }
  }

}
