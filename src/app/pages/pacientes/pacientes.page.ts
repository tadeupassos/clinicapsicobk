import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Paciente } from 'src/app/interfaces/paciente';
import { Subscription } from 'rxjs';
import { PacienteService } from 'src/app/services/paciente.service';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { PsicologoService } from 'src/app/services/psicologo.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
})
export class PacientesPage implements OnInit {

  pacientes = new Array<Paciente>();
  todosPacientes = new Array<Paciente>();
  private pacientesSubscription: Subscription;

  filtrarPsicologo: string = 'Selecionar';
  totalPacientes = 0;

  psicologos = new Array<Psicologo>();
  private psicologoSubscription: Subscription;  

  buscaLetra: string = '';  

  permissao : boolean = false;

  constructor(
    public modalController: ModalController,
    private pacienteService: PacienteService,
    private loadingCtrl: LoadingController,
    private toastCrtl: ToastController,
    private psicologoService: PsicologoService
  ) { 

    this.pacientesSubscription = this.pacienteService.getPacientes().subscribe(data => {
      this.todosPacientes = data;

      this.todosPacientes.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });

      this.pacientes = this.todosPacientes;
      this.totalPacientes = this.pacientes.length;
    });

    this.psicologoSubscription = this.psicologoService.getPsicologos().subscribe(data => {
      this.psicologos = data;
      this.psicologos.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });
    });  

  }

  ngOnInit() {
    this.permissao = (window.localStorage.getItem("logado") == "fernando.lira");
  }

  ngOndestroy(){
    this.pacientesSubscription.unsubscribe();
    this.psicologoSubscription.unsubscribe();
  }

  filtrarPorLetra(ev: any){

    const val = ev.target.value;
    this.buscaLetra = val;

    if(this.filtrarPsicologo == "Todos"){
      this.pacientes = this.todosPacientes.filter((p:Paciente) => {
        return p.nome.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
     }else{
      this.pacientes = this.todosPacientes.filter((p:Paciente) => {
        return p.nome.toLowerCase().indexOf(val.toLowerCase()) > -1 && 
               p.psicologo == this.filtrarPsicologo;
      });
    }

    this.totalPacientes = this.pacientes.length;

  }

  setaFiltroPsico(){

    if(this.filtrarPsicologo == "Todos"){
      if(this.buscaLetra == ''){
        this.pacientes = this.todosPacientes;
      }else{
        this.pacientes = this.todosPacientes.filter((p:Paciente) => {
          return p.nome.toLowerCase().indexOf(this.buscaLetra.toLowerCase()) > -1;
        });
      }
      
    }else if(this.buscaLetra == ''){
      this.pacientes = this.todosPacientes.filter((p:Paciente) => {
        return p.psicologo == this.filtrarPsicologo;
      });
    }else{
      this.pacientes = this.todosPacientes.filter((p:Paciente) => {
        return p.psicologo == this.filtrarPsicologo && 
               p.nome.toLowerCase().indexOf(this.buscaLetra.toLowerCase()) > -1;
      });
    }

    this.totalPacientes = this.pacientes.length;

  }
 

}
