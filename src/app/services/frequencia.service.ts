import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrequenciaService {

  private frequenciasCollection: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.frequenciasCollection = this.afs.collection<any>('Frequencia');
  }

  getFrequencias(){
    return this.frequenciasCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
   }  

   addFrequencia(frequencia: any){
      return this.frequenciasCollection.add(frequencia);
   }

   getFrequencia(id: string){
    return this.frequenciasCollection.doc<any>(id).valueChanges();
   }

   updateFrequencia(id: string, frequencia: any){
    return this.frequenciasCollection.doc<any>(id).update(frequencia);
   }

   deleteFrequencia(id: string){
    return this.frequenciasCollection.doc(id).delete();
   }

}
