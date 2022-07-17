import { Injectable } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private sessoesCollection: AngularFirestoreCollection<Sessao>;

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

}
