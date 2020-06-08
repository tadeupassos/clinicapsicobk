import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Prontuario } from 'src/app/interfaces/prontuario';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PacienteService } from 'src/app/services/paciente.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { Paciente } from 'src/app/interfaces/paciente';

@Component({
  selector: 'app-prontuario',
  templateUrl: './prontuario.page.html',
  styleUrls: ['./prontuario.page.scss'],
})
export class ProntuarioPage implements OnInit {

  public numeroProntuario: number = 0;

  public fGroup: FormGroup;
  public paciente: Paciente = {};
  //private prontuario: Prontuario = {};
  private pacienteId: string = null;
  private pacienteSubscription: Subscription;    

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private pacienteService: PacienteService,
    private navCtrl: NavController,
    private servicos: ServicosService
  ) {   
    
    this.fGroup = this.fBuilder.group({
      'demanda': [''],
      'objetivos': [''],
      'evolucao': [''],
      'procedimentos': [''],
      'encaminhamento': ['']
    });       

    this.pacienteId = this.activeRoute.snapshot.params['idPaciente'];

    this.pacienteSubscription = this.pacienteService.getPaciente(this.pacienteId).subscribe(data => {
      this.paciente = data;
      this.numeroProntuario = this.paciente.prontuario.codigo;

      // this.paciente.prontuario.evolucao = "04/03/2020 - Title allows you to set the text that appears to the left of the textarea." + "\n\n" + 
      // "10/03/2020 - Title allows you to set the text that appears to the left of the textarea. ";

      this.fGroup = this.fBuilder.group({
        'demanda': [this.paciente.prontuario.demanda],
        'objetivos': [this.paciente.prontuario.objetivos],
        'evolucao': [this.paciente.prontuario.evolucao],
        'procedimentos': [this.paciente.prontuario.procedimentos],
        'encaminhamento': [this.paciente.prontuario.encaminhamento]
      });       
    });
  }  

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.pacienteSubscription) this.pacienteSubscription.unsubscribe();
  }

  async salvarDados(){
    await this.servicos.presentLoading();
    this.paciente.prontuario = this.fGroup.value;

    try {
      await this.pacienteService.updatePaciente(this.pacienteId, this.paciente);
      await this.servicos.loading.dismiss();
      this.navCtrl.navigateBack('/menu/pacientes');
    } catch (error) {
      this.servicos.presentToast('Erro ao tentar salvar');
      this.servicos.loading.dismiss();
    }

  }
}
