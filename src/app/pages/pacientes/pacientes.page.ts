import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Paciente } from 'src/app/interfaces/paciente';
import { Subscription } from 'rxjs';
import { PacienteService } from 'src/app/services/paciente.service';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { PsicologoService } from 'src/app/services/psicologo.service';
import { SessaoService } from 'src/app/services/sessao.service';
import { ServicosService } from 'src/app/services/servicos.service';

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

  private codigoSubscription: Subscription;  
  private codigoProntuarioId: string = null;
  public novoCodigo: number;

  constructor(
    public modalController: ModalController,
    private pacienteService: PacienteService,
    private loadingCtrl: LoadingController,
    private toastCrtl: ToastController,
    private psicologoService: PsicologoService,
    private sessaoService: SessaoService,
    public serv: ServicosService
  ) { 

    this.pacientesSubscription = this.pacienteService.getPacientes().subscribe(data => {
      this.todosPacientes = data;

      console.log("this.todosPacientes",this.todosPacientes);

      this.todosPacientes.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });

      this.pacientes = this.todosPacientes;
      this.totalPacientes = this.pacientes.length;
    });

    this.psicologoSubscription = this.psicologoService.getPsicologos().subscribe(data => {
      this.psicologos = data;
      this.psicologos.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });
      console.log("this.psicologos",this.psicologos);
    });  

    this.codigoSubscription = this.pacienteService.getCodigoProntuario().subscribe((c:any) => {
      this.novoCodigo = c[0].valor + 1;
      this.codigoProntuarioId = c[0].id;
      console.log("novoCodigo:",this.novoCodigo);
      //this.setaProntuario();
    })

  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.serv.permissao = localStorage["logado"] == "fernando.lira";
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

    console.log("this.pacientes",this.pacientes);

    this.totalPacientes = this.pacientes.length;

    //if(this.filtrarPsicologo == "Rosiana Maria da Silva"){
    if(this.filtrarPsicologo == "Isabelle Giorfi Idelfonso"){
      console.log("this.filtrarPsicologo: ",this.filtrarPsicologo);
      this.alterarCadastroPaciente();
    }

  }

  async alterarCadastroPaciente(){

    this.sessaoService.getSessoesPorPsic("Isabelle Giorfi Idelfonso")
    .subscribe(async (sessoes:any) => {

      sessoes.sort((a,b) => {
        let dataCompletaA = new Date([a.ano,a.mes,a.dia].join("-") + " " + a.horaSessao);
        let dataCompletaB = new Date([b.ano,b.mes,b.dia].join("-") + " " + b.horaSessao);
        return  dataCompletaA < dataCompletaB ? -1 : 1;
      });

      console.log("sessoes Isabelle: ",sessoes);

      // pegando somente  as sessoes que  nao  tem dataSessaoStamp
      let semTimeStamp = sessoes.filter((s:any) => {
        return !s.dataSessaoStamp
      });
      console.log("sem dataSessaoStamp", semTimeStamp);

      //this.setDataSessaoStamp(semTimeStamp);

      // for (const s of sessoes) {

      //   if(s.crp != "6145103"){
      //     console.log("crp diferente: ",s);
      //   }

        // s.crp = "145966"
        // console.log("sessao: ",s);
        // await this.sessaoService.updateSessao(s.id,s);
      //}
    })
  }

  async setDataSessaoStamp(sessoes:any){

    for (const s of sessoes) {
      
      let [dia,mes,ano] = s.dataSessao.split("/");
      s.dataSessaoStamp = new Date(Number(ano),Number(mes) - 1,Number(dia),0,0,0).getTime();

      await this.sessaoService.updateSessao(s.id,s);
      console.log(s.dataSessaoStamp);
        
    }
  }

  async setaProntuario(){
    let semPronturario = this.pacientes.filter((p:Paciente) => {
      return !p.prontuario.codigo;
    });

    for (const p of semPronturario) {
      this.novoCodigo++;
      p.prontuario.codigo = this.novoCodigo;
      console.log("this.novoCodigo",this.novoCodigo);
      //this.pacienteService.updatePaciente(p.id,p)
    }

    let prontuarios = this.pacientes.sort((a,b) => {
      return a.prontuario.codigo < b.prontuario.codigo ? -1 : 1;
    });

    console.log("prontuarios",prontuarios.map( p => p.prontuario.codigo));

  }
 

}
