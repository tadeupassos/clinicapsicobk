import { Injectable } from '@angular/core';
import { Sessao } from '../interfaces/sessao';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  private sessoesCollection: AngularFirestoreCollection<Sessao>;

  constructor(private afs: AngularFirestore) { 
    this.sessoesCollection = this.afs.collection<Sessao>('Sessoes');
  }

  getSessoes(pacienteId){
    return this.sessoesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        }).filter(s => {
          return s.pacienteId == pacienteId;
        });
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

    [ano,mes,dia] = f.fim.split("-");
    let fim = new Date(Number(ano),Number(mes) -1 ,Number(dia),0,0,0).getTime();

    let query = this.afs.collection<Sessao>('Sessoes').ref
    .where('dataSessaoStamp', '>=', inicio)
    .where('dataSessaoStamp', '<=', fim);

    if(f.atendimento != "Todos"){
      query = query.where('atendimento', '==', f.atendimento);
    }

    if(f.convenio != "Todos"){
      query = query.where('nomeConvenio', '==', f.convenio);
    }

    if(f.psicologo != "Todos"){
      query = query.where('crp', '==', f.psicologo);
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
      })
    )
  }

}
