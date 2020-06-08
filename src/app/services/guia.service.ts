import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Guia } from '../interfaces/guia';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GuiaService {

  private guiasCollection: AngularFirestoreCollection<Guia>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.guiasCollection = this.afs.collection<Guia>('Guias');
  }

  getGuias(){
    return this.guiasCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
   }  

   addGuia(guia: Guia){
      return this.guiasCollection.add(guia);
   }

   getGuia(id: string){
    return this.guiasCollection.doc<Guia>(id).valueChanges();
   }

   updateGuia(id: string, guia: Guia){
    return this.guiasCollection.doc<Guia>(id).update(guia);
   }

   deleteGuia(id: string){
    return this.guiasCollection.doc(id).delete();
   }

}