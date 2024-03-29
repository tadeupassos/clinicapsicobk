import { Component, OnInit } from '@angular/core';
import { Convenio } from 'src/app/interfaces/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';
import { PsicologoService } from 'src/app/services/psicologo.service';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { Subscription } from 'rxjs';
import { Sessao } from 'src/app/interfaces/sessao';
import { SessaoService } from 'src/app/services/sessao.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { resolve } from 'url';
import { FrequenciaService } from 'src/app/services/frequencia.service';

@Component({
  selector: 'app-fechamento',
  templateUrl: './fechamento.page.html',
  styleUrls: ['./fechamento.page.scss'],
})
export class FechamentoPage implements OnInit {

  filtro = {
    inicio: "",
    fim: "",
    atendimento: "Convênio",
    convenio: "Todos",
    psicologo: "Todos"
  }

  convenios = new Array<Convenio>();
  convenioSubscription: Subscription;
  
  psicologos = new Array<Psicologo>();
  psicologoSubscription: Subscription;  

  resultadoSubscription: Subscription; 

  frequenciaSubscription: Subscription;

  particular: any = {
    qtde: 0,
    valor: 0,
    subLocacao: 0
  }

  convenio: any = {
    qtde: 0,
    valor: 0,
    repasse: 0,
    naoRepasse: 0
  }

  qtdeSessoes = 0;
  valorTotal = 0;

  resumo = [];
  convAtend = [];

  listaNaoRepasse = [];

  chkPresenca = true;
  chkFaltaPaciente = false;
  chkFaltaJustificadaPaciente = false;
  chkFaltaTerapeuta = false;
  chkFaltaJustificadaTerapeuta = false;
  chkRecessosFeriados = false;
  chkManutencaoPredial = false;
  chkReposicao = false;

  mostrarCards = false;

  constructor(
    private convenioService: ConvenioService,
    private psicologoService: PsicologoService,
    private sessaoService: SessaoService,
    private servicos: ServicosService,
    private frequenciaServ: FrequenciaService
  ) {
    this.convenioSubscription = this.convenioService.getConvenios().subscribe((c:Array<Convenio>) => {
      this.convenios = c;
    });

    this.psicologoSubscription = this.psicologoService.getPsicologos().subscribe((p:Array<Psicologo>) => {
      this.psicologos = p;

      this.psicologos.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });
    });

    let pacienteSubscription: Subscription = this.sessaoService.getSessoesPorPaciente().subscribe((s:Array<Sessao>) => {
      console.log("vinicius nome",s);
    })

    this.getSessoesPorPsic();

    this.frequenciaSubscription = this.frequenciaServ.getFrequencias()
    .subscribe((frequencias:any) => {
      this.listaNaoRepasse = frequencias.filter(f => f.repasse == "N");
    });

   }

  ngOnInit() {
    this.setaDatas();
  }

  ngOndestroy() {
    this.convenioSubscription.unsubscribe();
    this.psicologoSubscription.unsubscribe();
    this.frequenciaSubscription.unsubscribe();
    if(this.resultadoSubscription) this.resultadoSubscription.unsubscribe();
  }

  async filtrar(){
    await this.servicos.presentLoading();
    this.resultadoSubscription = this.sessaoService.getSessaoPorFiltro(this.filtro)
    .subscribe((sessoes:Array<Sessao>) => {
      console.log("this.resultado",sessoes);

      this.convenio.qtde = 0;
      this.convenio.valor = 0;
      this.convenio.repasse = 0;
      this.particular.qtde = 0; 
      this.particular.valor = 0;
      this.particular.subLocacao = 0;

      let convenio = sessoes.filter((f:Sessao) => { return f.atendimento == "Convênio" });
      this.convenio.qtde = convenio.length;
      convenio.forEach((c:Sessao) => {
        
        if(!c.valor){
          c.valor = this.convenios.find((conv:Convenio) => conv.convenio == c.nomeConvenio).valor;
        }

        this.convenio.valor += Number(c.valor.replace(",","."));
        this.convenio.repasse += Number(this.servicos.cobranca.Repasse.replace(",","."));
      });
  
      let particular = sessoes.filter((f:Sessao) => { return f.atendimento == "Particular" });
      this.particular.qtde = particular.length;
      particular.forEach((c:Sessao) => {

        if(!c.valor){
          c.valor = this.convenios.find((conv:Convenio) => conv.convenio == c.nomeConvenio).valor;
        }

        this.particular.valor += Number(c.valor.replace(",","."));
        this.particular.subLocacao += Number(this.servicos.cobranca.Sublocacao.replace(",","."));
      });

      this.resumo = [];

      this.psicologos.forEach((p:Psicologo) => {
        
        // Pegando todas as sessoes do psicologo
        let sp = sessoes.filter((s:Sessao) => { return s.crp == p.crp });

        if(sp.length >  0){
          let particular = sp.filter((f:Sessao) => { return f.atendimento == "Particular" });
          let convenio = sp.filter((f:Sessao) => { return f.atendimento == "Convênio" });
  
          let psico = { 
            nome: p.nome,
            qtdeParticular: particular.length,
            valorParticular: 0,
            subLocacao: 0,
            qtdeConvenio: convenio.length,
            valorConvenio: 0,
            repasse: 0,
            convenios: [],
            naoRepasse: 0,

            faltaPaciente: convenio.filter((f:Sessao) => { return f.frequencia == "Falta Paciente" }).length,
            faltaJustificadaPaciente: convenio.filter((f:Sessao) => { 
              return f.frequencia == "Falta Justificada Paciente" }).length,
            faltaTerapeuta: convenio.filter((f:Sessao) => { return f.frequencia == "Falta Terapeuta" }).length,
            faltaJustificadaTerapeuta: convenio.filter((f:Sessao) => { 
              return f.frequencia == "Falta Justificada Terapeuta" }).length,
            recessosFeriados: convenio.filter((f:Sessao) => { 
                return f.frequencia == "Recessos e Feriados" }).length,
            manutencaoPredial: convenio.filter((f:Sessao) => { 
                  return f.frequencia == "Manutenção Predial" }).length,

            reposicao: convenio.filter((f:Sessao) => { return f.frequencia == "Reposição" }).length,

            presencaC: convenio.filter((f:Sessao) => { return f.frequencia == "Presença" }).length,
            faltaC: convenio.filter((f:Sessao) => { return f.frequencia == "Falta" }).length,
            faltaJc: convenio.filter((f:Sessao) => { return f.frequencia == "Falta Justificada" }).length,
            faltaTc: convenio.filter((f:Sessao) => { return f.frequencia == "Falta do Terapeuta" }).length,
            faltaFc: convenio.filter((f:Sessao) => { return f.frequencia == "Feriado" }).length,
            presencaP: particular.filter((f:Sessao) => { return f.frequencia == "Presença" }).length,
            faltaP: particular.filter((f:Sessao) => { return f.frequencia == "Falta" }).length,
            faltaJp: particular.filter((f:Sessao) => { return f.frequencia == "Falta Justificada" }).length,
            faltaTp: particular.filter((f:Sessao) => { return f.frequencia == "Falta do Terapeuta" }).length,
            faltaFp: particular.filter((f:Sessao) => { return f.frequencia == "Feriado" }).length,
          }

          // Presença
          // Falta
          // Falta Justificada
          // Falta do Terapeuta
          // Feriado
  
          convenio.forEach((c:Sessao) => {
            psico.valorConvenio += Number(c.valor.replace(",","."));
            psico.repasse += Number(this.servicos.cobranca.Repasse.replace(",","."));
          });
  
          particular.forEach((c:Sessao) => {
            psico.valorParticular += Number(c.valor.replace(",","."));
            psico.subLocacao += Number(this.servicos.cobranca.Sublocacao.replace(",","."));
          });

          this.convenios.forEach((c:Convenio) => {
            let conv = {
              convenio: c.convenio,
              qtde: sp.filter((s:Sessao) => { return s.nomeConvenio == c.convenio }).length
            }
           if(conv.qtde > 0){
              psico.convenios.push(conv);
            }
          });

          /////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Tratamento para quando tem tipos de frequencias setados para não repassar
          let naoRepasse = 0;
          let valorRepasse = Number(this.servicos.cobranca.Repasse.replace(",","."));
          // if(this.listaNaoRepasse.find(t => t.tipo == "Falta Paciente")) naoRepasse += psico.faltaPaciente * valorRepasse;
          // if(this.listaNaoRepasse.find(t => t.tipo == "Falta Justificada Paciente")) naoRepasse += psico.faltaJustificadaPaciente * valorRepasse;
          // if(this.listaNaoRepasse.find(t => t.tipo == "Falta Terapeuta")) naoRepasse += psico.faltaTerapeuta * valorRepasse;
          // if(this.listaNaoRepasse.find(t => t.tipo == "Falta Justificada Terapeuta")) naoRepasse += psico.faltaJustificadaTerapeuta * valorRepasse;
          // if(this.listaNaoRepasse.find(t => t.tipo == "Recessos e Feriados")) naoRepasse += psico.recessosFeriados * valorRepasse;
          // if(this.listaNaoRepasse.find(t => t.tipo == "Manutenção Predial")) naoRepasse += psico.manutencaoPredial * valorRepasse;
          // if(this.listaNaoRepasse.find(t => t.tipo == "Reposição")) naoRepasse += psico.reposicao * valorRepasse;

          if(!this.chkPresenca) naoRepasse += psico.presencaC * valorRepasse;
          if(!this.chkFaltaPaciente) naoRepasse += psico.faltaPaciente * valorRepasse;
          if(!this.chkFaltaJustificadaPaciente) naoRepasse += psico.faltaJustificadaPaciente * valorRepasse;
          if(!this.chkFaltaTerapeuta) naoRepasse += psico.faltaTerapeuta * valorRepasse;
          if(!this.chkFaltaJustificadaTerapeuta) naoRepasse += psico.faltaJustificadaTerapeuta * valorRepasse;
          if(!this.chkRecessosFeriados) naoRepasse += psico.recessosFeriados * valorRepasse;
          if(!this.chkManutencaoPredial) naoRepasse += psico.manutencaoPredial * valorRepasse;
          if(!this.chkReposicao) naoRepasse += psico.reposicao * valorRepasse;

          console.log("Não repasse", naoRepasse);
          console.log("psico.repasse", psico.repasse);
          console.log("this.convenio.repasse", this.convenio.repasse);
          psico.repasse = psico.repasse - naoRepasse;
          psico.naoRepasse = naoRepasse;
          this.convenio.naoRepasse = naoRepasse;
          this.convenio.repasse = this.convenio.repasse - naoRepasse;
          
          this.resumo.push(psico);
          /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }

      });

      console.log("this.resumo",this.resumo);

      this.convAtend = [];

      this.convenios.forEach((c:Convenio) => {
        let conv = {
          convenio: c.convenio,
          qtde: sessoes.filter((s:Sessao) => { return s.nomeConvenio == c.convenio }).length
        }
       if(conv.qtde > 0){
          this.convAtend.push(conv);
        }
      });

      this.servicos.loading.dismiss();
    });
  }

  setaDatas(){
    let agora = new Date();
    let dataInicio: any;
    let dataFim: any;

    dataInicio = new Date(agora.getFullYear(),agora.getMonth(),1).getTime();
    dataFim = new Date(agora.getFullYear(),agora.getMonth() + 1,0).getTime();

    let [dia,mes,ano] = new Date(dataInicio).toLocaleDateString().split("/");
    this.filtro.inicio = [ano,mes,dia].join("-");

    [dia,mes,ano] = new Date(dataFim).toLocaleDateString().split("/");
    this.filtro.fim = [ano,mes,dia].join("-");
  }

  todasSessoes(){

    this.sessaoService.getSessoesGeral()
    .subscribe((sessoes:Array<Sessao>) => {

      // pegando somente  as sessoes que  nao  tem dataSessaoStamp
      let semTimeStamp = sessoes.filter((s:Sessao) => {
        return !s.dataSessaoStamp
      });
      console.log("sem dataSessaoStamp", semTimeStamp);

      //this.setDataSessaoStamp(semTimeStamp);
    })
    // .catch(err => {
    //   console.log("todasSessoes err", err);
    //   this.servicos.loading.dismiss()
    // })

  }

  getSessoesPorPsic(){

    this.sessaoService.getSessoesPorPsic("Ana Claudia Bertin")
    .subscribe((sessoes:any) => {
        console.log("sessoes Ana Claudia", sessoes);
        // let semTimeStamp = sessoes.filter((s:Sessao) => {
        //   return !s.dataSessaoStamp
        // });
        // console.log("semTimeStamp", semTimeStamp);
        //this.setDataSessaoStamp(semTimeStamp)
        let vinicius = sessoes.filter(s => 
          //s.nomePaciente.search("Vinicius") > -1
          s.nomePaciente == "Vinicius Willian da Silva Garcia" 
        );

        let vinicius2 = sessoes.filter(s => s.pacienteId == "9I3cU49KBdNcbS9IsVgv" );

        console.log("vinicius",vinicius);
        console.log("vinicius2",vinicius2);
    })
   }

  setDataSessaoStamp(sessoes: Array<Sessao>){

    sessoes.forEach(s => {

      let [dia,mes,ano] = s.dataSessao.split("/");
      s.dataSessaoStamp = new Date(Number(ano),Number(mes) - 1,Number(dia),0,0,0).getTime();

      this.sessaoService.updateSessao(s.id,s);
      console.log(s.dataSessaoStamp);
        
    });
  }
}
