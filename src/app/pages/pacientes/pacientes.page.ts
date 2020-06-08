import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Paciente } from 'src/app/interfaces/paciente';
import { Subscription } from 'rxjs';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
})
export class PacientesPage implements OnInit {

  public pacientes = new Array<Paciente>();
  private pacientesSubscription: Subscription;
  private loading: any;

  public buscaLetra: string = '';  

  constructor(
    public modalController: ModalController,
    private pacienteService: PacienteService,
    private loadingCtrl: LoadingController,
    private toastCrtl: ToastController
  ) { 

    this.pacientesSubscription = this.pacienteService.getPacientes().subscribe(data => {
      this.pacientes = data;
      //console.log(data);
    });

  }

  ngOnInit() {
  }

  ngOndestroy(){
    this.pacientesSubscription.unsubscribe();
  }  

  filtrarPorLetra(){

  }
 

}
