import { Component, OnInit } from '@angular/core';
import { Convenio } from 'src/app/interfaces/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';
import { PsicologoService } from 'src/app/services/psicologo.service';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { Subscription } from 'rxjs';
import { Sessao } from 'src/app/interfaces/sessao';
import { SessaoService } from 'src/app/services/sessao.service';
import { ServicosService } from 'src/app/services/servicos.service';

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

  particular: any = {
    qtde: 0,
    valor: 0,
    subLocacao: 0
  }

  convenio: any = {
    qtde: 0,
    valor: 0,
    repasse: 0
  }

  qtdeSessoes = 0;
  valorTotal = 0;

  resumo = [];
  convAtend = [];

  constructor(
    private convenioService: ConvenioService,
    private psicologoService: PsicologoService,
    private sessaoSevice: SessaoService,
    private servicos: ServicosService
  ) {
    this.convenioSubscription = this.convenioService.getConvenios().subscribe((c:Array<Convenio>) => {
      this.convenios = c;
    });

    this.psicologoSubscription = this.psicologoService.getPsicologos().subscribe((p:Array<Psicologo>) => {
      this.psicologos = p;

      this.psicologos.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });
    }); 
   }

  ngOnInit() {
    this.setaDatas();
  }

  ngOndestroy() {
    this.convenioSubscription.unsubscribe();
    this.psicologoSubscription.unsubscribe();
    if(this.resultadoSubscription) this.resultadoSubscription.unsubscribe();
  }

  async filtrar(){
    console.log("filtrar", this.filtro);
    await this.servicos.presentLoading();
    this.resultadoSubscription = this.sessaoSevice.getSessaoPorFiltro(this.filtro)
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
        this.convenio.valor += Number(c.valor.replace(",","."));
        this.convenio.repasse += Number(this.servicos.cobranca.Repasse.replace(",","."));
      });
  
      let particular = sessoes.filter((f:Sessao) => { return f.atendimento == "Particular" });
      this.particular.qtde = particular.length;
      particular.forEach((c:Sessao) => {
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
  
          this.resumo.push(psico);
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

}
