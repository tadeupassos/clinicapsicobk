import { Injectable } from '@angular/core';
import { Prontuario } from '../interfaces/prontuario';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  private prontuariosCollection: AngularFirestoreCollection<Prontuario>;
  private prontuarios = new Array<Prontuario>();
  private prontuariosSubscription: Subscription;

  constructor(private afs: AngularFirestore) { 
    this.prontuariosCollection = this.afs.collection<Prontuario>('Prontuarios');
  }
n
  getProntuarios(){
    return this.prontuariosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
  }  

  addProntuario(novoProntuario: Prontuario){
    return this.prontuariosCollection.add(novoProntuario);
  }

  getProntuario(id: string){
    return this.prontuariosCollection.doc<Prontuario>(id).valueChanges();
  }

  updateProntuario(id: string, prontuario: Prontuario){
    return this.prontuariosCollection.doc<Prontuario>(id).update(prontuario);
  }

  deleteProntuario(id: string){
    return this.prontuariosCollection.doc(id).delete();
  }  
}
