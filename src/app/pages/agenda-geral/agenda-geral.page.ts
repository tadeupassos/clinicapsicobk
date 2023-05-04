import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicosService } from 'src/app/services/servicos.service';
import { SessaoService } from 'src/app/services/sessao.service';
import { Sessao } from 'src/app/interfaces/sessao';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AtendimentoPage } from '../atendimento/atendimento.page';

@Component({
  selector: 'app-agenda-geral',
  templateUrl: './agenda-geral.page.html',
  styleUrls: ['./agenda-geral.page.scss'],
})
export class AgendaGeralPage implements OnInit {

  sessaoSubscription: Subscription;  
  resultadoSubscription: Subscription; 
  sessoes = new Array<Sessao>();

  anos = [];
  meses = [{ id: "01", nome: "Janeiro"}, { id: "02", nome: "Fevereiro" }, { id: "03", nome: "Março" }, 
          { id: "04", nome: "Abril" }, { id: "05", nome: "Maio" }, { id: "06", nome: "Junho" }, 
          { id: "07", nome: "Julho" }, { id: "08", nome: "Agosto" }, { id: "09", nome: "Setembro" }, 
          { id: "10", nome: "Outubro" }, { id: "11", nome: "Novembro" }, { id: "12", nome: "Dezembro" }];
  
  filtrarMes: string;
  filtrarAno: string;

  loading: any;
  isLoading = false;

  constructor(
    private servicos: ServicosService,
    private sessaoService: SessaoService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private alertController: AlertController,
  ) { 
    this.sessaoService.sessaoAdicionada = true;
    const hoje = new Date();

    let mes = (hoje.getMonth() + 1).toString();
    this.filtrarMes = mes.length > 1 ? mes : "0" + mes;
    this.filtrarAno = hoje.getFullYear().toString();

    for (let index = 22; index < 30; index++) {
      this.anos.push("20" + index);
    }
  }

 async ngOnInit() {
    console.log("ngOnInit", this.sessaoService.sessaoAdicionada);
    await this.presentLoading();
    await this.carregarSessoes();
  }

  ngOndestroy() {
    if(this.sessaoSubscription) this.sessaoSubscription.unsubscribe();
    if(this.resultadoSubscription) this.resultadoSubscription.unsubscribe();
  }

  async carregarSessoes(){
    console.log("carregarSessoes");
    // this.sessaoSubscription = this.sessaoService.getSessoesPorMesAnoTAKE1(this.filtrarMes, this.filtrarAno)
    // .subscribe(async (data: Array<Sessao>) => {
    //   this.sessoes = data.sort((a,b) => a.dataSessaoStamp < b.dataSessaoStamp ? -1 : 1 );
    //   this.sessoes = this.sessoes.filter((s:Sessao) => s.sala);
    //   console.log('this.sessoes', this.sessoes);
    //   await this.preparaMes();
    // });

    let sessoes: Array<Sessao> = await this.sessaoService.getSessoesPorMesAno(this.filtrarMes, this.filtrarAno).toPromise();
    this.sessoes = Object.assign({}, sessoes);
    this.sessoes = sessoes.sort((a,b) => a.dataSessaoStamp < b.dataSessaoStamp ? -1 : 1 );
    this.sessoes = this.sessoes.filter((s:Sessao) => s.sala);
    console.log('this.sessoes', this.sessoes);
    await this.preparaMes();
  }

  async setaFiltroMesAno(){
    await this.presentLoading();
    this.sessaoService.novaSessao = "Fitrando por mes ou ano";
    this.primeiro();
    await this.carregarSessoes();
  }

  setaScrollDia(dia:number){
    console.log("this.sessaoService.novaSessao", this.sessaoService.novaSessao);
    if(!this.sessaoService.novaSessao){
      let incrementa = 800 * Math.floor(dia/2);
      document.getElementById("elementRef").scrollLeft += dia > 3 ? incrementa : 0;
    } 
  }

  async preparaMes(){
    console.log("preparaMes");
    this.sessaoService.sessoesAgendaGeral = [];

    const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    const ultimoDia = new Date(Number(this.filtrarAno), Number(this.filtrarMes), 0);
    // console.log("ultimo dia", ultimoDia);
    // console.log("ultimoDia.getDate()", ultimoDia.getDate())

    for (let index = 1; index <= ultimoDia.getDate(); index++) {
      const diaFeito = new Date(Number(this.filtrarAno), Number(this.filtrarMes) - 1, index);
      // console.log("diaFeito", diaFeito);

      // Se não for domingo
      if(diaFeito.getDay() > 0) {
        // if(diaFeito.toLocaleDateString() == "01/12/2022")
        //   console.log("retornando")

        const sessoesDoDia = this.sessoes.filter((s:Sessao) => s.dataSessao == diaFeito.toLocaleDateString());
        //console.log("sessoesDoDia",sessoesDoDia);
        // console.log("diaFeito.toLocaleDateString()",diaFeito.toLocaleDateString());

        let dia = index.toString().length > 1 ? index.toString() : "0" + index.toString();

        let salas = [];

        for (let i = 0; i < 20; i++) {
          salas.push({
            sala1: this.setaLabel(sessoesDoDia,diaFeito.toLocaleDateString(),this.sessaoService.horarios[i],"1"),
            sala2: this.setaLabel(sessoesDoDia,diaFeito.toLocaleDateString(),this.sessaoService.horarios[i],"2"),
            sala3: this.setaLabel(sessoesDoDia,diaFeito.toLocaleDateString(),this.sessaoService.horarios[i],"3")
          });
        }

        let diaSalas = {
          data: dias[diaFeito.getDay()] + " - " + [dia,this.filtrarMes,this.filtrarAno].join("/"),
          salas
        }

        this.sessaoService.sessoesAgendaGeral.push(diaSalas);
      }
    }
    console.log("this.sessaoService.sessoesAgendaGeral",this.sessaoService.sessoesAgendaGeral);
    await this.dismiss();
    this.setaScrollDia(new Date().getDate());
  }

  setaLabel(sd:Array<Sessao>, data:string, hora:string, sala:string) {
    const res: Sessao = sd.find((s:Sessao) => s.horaSessao == hora && s.sala == sala);
    
    let dadosSessao = { data, hora, sala };

    if(res){
      let psicologo = res.psicologo == res.psicologo.toUpperCase() ? res.psicologo.substring(0,18) : res.psicologo.substring(0,23);

      let psicor = this.servicos.Psicores.find(c => c.crp == res.crp) ? this.servicos.Psicores.find(c => c.crp == res.crp).cor : '#ffffff';

      let paciente = res.nomePaciente == res.nomePaciente.toUpperCase() ? res.nomePaciente.substring(0,18) : res.nomePaciente.substring(0,23);

      let frequencia = res.frequencia;

      let convenio = res.nomeConvenio;

      let passouCartao = res.passouCartao ? res.passouCartao : false;

      return {
        mostrar: { psicologo, paciente, psicor, frequencia, convenio, passouCartao },
        sessaoId: res.id,
        sessaoInteira: res,
        ...dadosSessao
      } 
    }else{

      return {
        mostrar: "+",
        ...dadosSessao
      };
    } 
  }

  agendar(sala:any){
    console.log('sala',sala);
    this.sessaoService.novaSessao = sala;
    if(sala.mostrar == '+'){
      this.router.navigateByUrl('/menu/add-sessao');
    }else{
      this.router.navigateByUrl(`/menu/add-sessao/${sala.sessaoId}`);
    }
  }

  // async presentLoading(){
  //   this.loading = await this.loadingCtrl.create({ message: "Por favor, aguarde..." });
  //   return this.loading.present();
  // }

  async presentLoading() {
    console.log('iniciando o loading');
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: "Por favor, aguarde..."
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    console.log('finaliza o loading');
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  async setarAtendimento(id:string) {
    console.log("id",id);
    const modal = await this.modalController.create({
      component: AtendimentoPage,
      backdropDismiss: false,
      componentProps : { id }
    });

    modal.onDidDismiss().then(async (res:any) => {
      if(res.data != 'nada'){
        console.log('res.data', res.data);
        await this.presentLoading();
        const sessao:Sessao = res.data.sessao;

        this.sessaoService.novaSessao = sessao;
        await this.sessaoService.updateSessao(res.data.id, sessao);

        //////////////////////////////////////////////////////////////
        // Setando no array da agenda a sessão alterada
        this.sessaoService.sessoesAgendaGeral.map((agenda:any) => {
          // Pega o dia correto
          if(agenda.data.split(' - ')[1] == sessao.dataSessao){
            agenda.salas.map((sala:any) => {
              // Pega a sala e a hora corretos
              if(sala[`sala${sessao.sala}`].hora == sessao.horaSessao){
                console.log('mesma hora sessao', sessao.dataSessao);
                sala[`sala${sessao.sala}`].mostrar.frequencia = sessao.frequencia;
              }
            });
          }
        });

        await this.dismiss();
      }
    });

    return await modal.present();
  }

  primeiro(){
    document.getElementById("elementRef").scrollLeft = 0;
  }

  recuar(){
    document.getElementById("elementRef").scrollLeft -= 800;
  }

  hoje(){
    document.getElementById("elementRef").scrollLeft = 0;
    this.sessaoService.novaSessao = undefined; 
    this.setaScrollDia(new Date().getDate());
  }

  avancar(){
    document.getElementById("elementRef").scrollLeft += 800;
  }

  ultimo(){
    document.getElementById("elementRef").scrollLeft += 800 * 16;
  }

  async remover(sessao:Sessao,sessaoId:string) {
    const alert = await this.alertController.create({
      header: 'Tem certeza que deseja excluir!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Sim',
          handler: async () => {
            this.sessaoService.novaSessao = sessao;
            await this.presentLoading();
            this.sessaoService.deleteSessao(sessaoId);

            //////////////////////////////////////////////////////////////
            // Setando no array da agenda a sessão alterada
            this.sessaoService.sessoesAgendaGeral.map((agenda:any) => {
              // Pega o dia correto
              if(agenda.data.split(' - ')[1] == sessao.dataSessao){
                agenda.salas.map((sala:any) => {
                  // Pega a sala e a hora corretos
                  if(sala[`sala${sessao.sala}`].hora == sessao.horaSessao){
                    // Apagar a sessao da agenda
                    sala[`sala${sessao.sala}`] = { 
                      mostrar: "+", 
                      data: sessao.dataSessao, 
                      hora: sessao.horaSessao,
                      sala: sessao.sala
                    };
                  }
                });
              }
            });
            await this.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async copiarSemana(dia:string){
    const alert = await this.alertController.create({
      header: 'Deseja copiar a agenda da semana passada para esta semana? (Se houver sessões nesta semana elas serão substituídas pela cópia.)' ,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: async () => {
            console.log("dia",dia);
            await this.presentLoading();
            this.copiarSessoesDaSemana(dia);
            await this.dismiss();
            this.copiaFinalizada();
          }
        }
      ]
    });

    await alert.present();
  }

  async copiaFinalizada(){
    const alert = await this.alertController.create({
      header: 'Cópia da semana finalizada com sucesso!' ,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'OK',
          handler: (blah) => {
            console.log('Confirm OK: OK');
          }
        }
      ]
    });

    await alert.present();
  }

  async copiarSessoesDaSemana(copiar:string){

    let [dia,mes,ano] = copiar.split(" - ")[1].split("/");
    //console.log("Ano mes dia", dia + " " + mes + " " + ano);

    // Se existir sessoes na semana que vai receber a cópia, então serão apagadas
    await this.apagaSessoesSemanaCopia(dia,mes,ano);

    let dataGerada = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0);
    //console.log("dataGerada.toLocaleDateString()", dataGerada.toLocaleDateString());
    let sabado = new Date(dataGerada.setDate(dataGerada.getDate() - 2)).toLocaleDateString();
    //console.log("sabado", sabado);

    let segunda = new Date(dataGerada.setDate(dataGerada.getDate() - 5)).toLocaleDateString();
    //console.log("segunda", segunda);

    let inicio = segunda.split("/").reverse().join("-");
    let fim = sabado.split("/").reverse().join("-");

    const sessoes = await this.sessaoService.getTodasSessoesPorMesAno(inicio,fim).toPromise();
    //console.log("sessoes da copia",sessoes.filter(s => s.sala));

    for (const s of sessoes.filter(s => s.sala)) {
      // console.log("s", s)
      // console.log("s.dataSessao", s.dataSessao)
      // console.log("7 das depois", new Date(s.dataSessaoStamp));
      let dtPorStamp = new Date(s.dataSessaoStamp);
      let semanaSeguinte = new Date(dtPorStamp.setDate(dtPorStamp.getDate() + 7));

      delete s.id;
      s.dia = semanaSeguinte.toLocaleDateString().split("/")[0];
      s.mes = semanaSeguinte.toLocaleDateString().split("/")[1];
      s.ano =semanaSeguinte.toLocaleDateString().split("/")[2];
      s.dataSessao = semanaSeguinte.toLocaleDateString();
      s.dataSessaoStamp = semanaSeguinte.getTime();
      s.evolucao = "";
      s.frequencia = "";
      s.conteudo = "";
      console.log("adicionar sessao");
      await this.sessaoService.addSessao(s);

      let psicor = 
        this.servicos.Psicores.find(c => c.crp == s.crp) 
        ? this.servicos.Psicores.find(c => c.crp == s.crp).cor 
        : '#ffffff';

      this.sessaoService.setaNoArrayDaAgenda(s, psicor);
    }
  }

  async apagaSessoesSemanaCopia(d:string,m:string,a:string) {
    let dataSemana = new Date(Number(a),Number(m) -1 ,Number(d),0,0,0);
    let segunda = dataSemana.toLocaleDateString();
    //console.log("segunda", segunda);
    let sabado = new Date(dataSemana.setDate(dataSemana.getDate() + 5)).toLocaleDateString();
    //console.log("sabado", sabado);
    let inicio = segunda.split("/").reverse().join("-");
    let fim = sabado.split("/").reverse().join("-");
    const sessoes = await this.sessaoService.getTodasSessoesPorMesAno(inicio,fim).toPromise();

    for (const s of sessoes.filter(s => s.sala)) {
      console.log("apagar sessao");
      await this.sessaoService.deleteSessao(s.id);

      //////////////////////////////////////////////////////////////
      // Setando no array da agenda a sessão alterada
      this.sessaoService.sessoesAgendaGeral.map((agenda:any) => {
        // Pega o dia correto
        if(agenda.data.split(' - ')[1] == s.dataSessao){
          agenda.salas.map((sala:any) => {
            // Pega a sala e a hora corretos
            if(sala[`sala${s.sala}`].hora == s.horaSessao){
              // Apagar a sessao da agenda
              sala[`sala${s.sala}`] = { 
                mostrar: "+", 
                data: s.dataSessao, 
                hora: s.horaSessao,
                sala: s.sala
              };
            }
          });
        }
      });
    }
  }

  setarPassouCartao(sessao: Sessao, id:string){
    sessao.passouCartao = !sessao.passouCartao;
    this.sessaoService.updateSessao(id, sessao);

    //////////////////////////////////////////////////////////////
    // Setando no array da agenda a sessão alterada
    this.sessaoService.sessoesAgendaGeral.map((agenda:any) => {
      // Pega o dia correto
      if(agenda.data.split(' - ')[1] == sessao.dataSessao){
        agenda.salas.map((sala:any) => {
          // Pega a sala e a hora corretos
          if(sala[`sala${sessao.sala}`].hora == sessao.horaSessao){
            sala[`sala${sessao.sala}`].mostrar.passouCartao = sessao.passouCartao;
          }
        });
      }
    });
  }
}
