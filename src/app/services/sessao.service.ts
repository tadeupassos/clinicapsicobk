import { Injectable } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private sessoesCollection: AngularFirestoreCollection<Sessao>;
  public novaSessao: any;
  public sessoesAgendaGeral = [];
  sessaoAdicionada = false;

  public horarios = ['07:00','07:45','08:30','09:15','10:00','10:45','11:30','12:15','13:00','13:45','14:30','15:15', '16:00','16:45','17:30','18:15','19:00','19:45','20:30','21:15'];

  constructor(private afs: AngularFirestore) { 
    this.sessoesCollection = this.afs.collection<Sessao>('Sessoes');
  }

  getSessoesGeral(){
    return this.sessoesCollection.snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        })
      })
    )
   }  

  addSessao(sessao: Sessao){
    return this.sessoesCollection.add(sessao);
  }

   getSessao(id: string){
    return this.sessoesCollection.doc<Sessao>(id).valueChanges();
  }

   updateSessao(id: string, sessao: Sessao){
    return this.sessoesCollection.doc<Sessao>(id).update(sessao);
  }

   deleteSessao(id: string){
    return this.sessoesCollection.doc(id).delete();
  }
  
  getSessaoPorFiltro(f:any){

    let [ano,mes,dia] = f.inicio.split("-");
    let inicio = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

    console.log("inicio",inicio);

    [ano,mes,dia] = f.fim.split("-");
    let fim = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

    console.log("fim",fim);

    let query = this.afs.collection<Sessao>('Sessoes').ref
    .where('dataSessaoStamp', '>=', inicio)
    .where('dataSessaoStamp', '<=', fim)
    .where('atendimento', '==', f.atendimento);

    // if(f.atendimento != "Todos"){
    //   query = query.where('atendimento', '==', f.atendimento);
    // }

    if(f.convenio != "Todos"){
      query = query.where('nomeConvenio', '==', f.convenio);
      console.log("f.convenio",f.convenio);
    }

    if(f.psicologo != "Todos"){
      query = query.where('crp', '==', f.psicologo);
      console.log("f.psicologo",f.psicologo);
    }

    return this.afs.collection<Sessao>('Sessoes', ref => query)
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        .filter(f => f.frequencia != "");
      })
    )
  }

  getSessoesAgendadas(crp: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('frequencia', '==', '')
    ).snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesFinalizadas(crp: string, mes: string, ano: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('mes', '==', mes)
      .where('ano', '==', ano)
      .where('frequencia', 'in', ['Presença', 'Falta Paciente', 'Falta Justificada Paciente', 'Falta Terapeuta', 'Falta Justificada Terapeuta', 'Recessos e Feriados', 'Manutenção Predial', 'Reposição'])
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesPorPsic(psicologo: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      //.where('crp', '==', crp)
      .where('psicologo', '==', psicologo)
    ).snapshotChanges()
    .pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesPorPaciente() {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      //.where('crp', '==', crp)
      //"Vinicius Willian da Silva Garcia"
      .where('nomePaciente', '==',"Vinicius Willian da Silva Garcia")
      //.orderBy('nomePaciente').startAt('Viniciu')
    ).snapshotChanges()
    .pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesSemProntuario(crp: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('crp', '==', crp)
      .where('frequencia', '==', 'Presença')
      .where('evolucao', '==', '')
    ).snapshotChanges().pipe(
      //take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesPorMesAno(mes: string, ano: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('mes', '==', mes)
      .where('ano', '==', ano)
      //.where('frequencia', '==', '')
    ).snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getSessoesPorMesAnoTAKE1(mes: string, ano: string) {
    return this.afs.collection<Sessao>('Sessoes', ref => ref
      .where('mes', '==', mes)
      .where('ano', '==', ano)
      //.where('frequencia', '==', '')
    ).snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getTodasSessoesPorMesAno(inicio: any, fim: any) {

    let [ano,mes,dia] = inicio.split("-");
    inicio = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

    console.log("inicio",inicio);

    [ano,mes,dia] = fim.split("-");
    fim = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

    console.log("fim",fim);

    return this.afs.collection<Sessao>('Sessoes', ref => ref
    .where('dataSessaoStamp', '>=', inicio)
    .where('dataSessaoStamp', '<=', fim)
    ).snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  setaNoArrayDaAgenda(sessao:Sessao, psicor:string){

    let psicologo = 
      sessao.psicologo == sessao.psicologo.toUpperCase() 
      ? sessao.psicologo.substring(0,18) 
      : sessao.psicologo.substring(0,23);

    let paciente = 
      sessao.nomePaciente == sessao.nomePaciente.toUpperCase() 
      ? sessao.nomePaciente.substring(0,18) 
      : sessao.nomePaciente.substring(0,23);

    let frequencia = sessao.frequencia;

    //////////////////////////////////////////////////////////////
    // Setando no array da agenda a sessão alterada
    this.sessoesAgendaGeral.map((agenda:any) => {
      // Pega o dia correto
      if(agenda.data.split(' - ')[1] == sessao.dataSessao){
        agenda.salas.map((sala:any) => {
          // Pega a sala e a hora corretos
          if(sala[`sala${sessao.sala}`].hora == sessao.horaSessao){
            // Adicionar a sessao na agenda
            sala[`sala${sessao.sala}`] = {
              mostrar: { psicologo, paciente, psicor, frequencia },
              sessaoId: sessao.id,
              sessaoInteira: sessao,
              data: sessao.dataSessao,
              hora: sessao.horaSessao, 
              sala: sessao.sala
            };
          }
        });
      }
    });
  }

}
