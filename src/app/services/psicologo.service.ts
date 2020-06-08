import { Injectable } from '@angular/core';
import { Psicologo } from '../interfaces/psicologo';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {

  private psicologosCollection: AngularFirestoreCollection<Psicologo>;

  constructor(private afs: AngularFirestore) { 
    this.psicologosCollection = this.afs.collection<Psicologo>('Psicologos');
  }

  getPsicologos(){
    return this.psicologosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        });
      })
    )
   }  

  addPsicologo(psicologo: Psicologo){
    return this.psicologosCollection.add(psicologo);
  }

   getPsicologo(id: string){
    return this.psicologosCollection.doc<Psicologo>(id).valueChanges();
  }

   updatePsicologo(id: string, psicologo: Psicologo){
    return this.psicologosCollection.doc<Psicologo>(id).update(psicologo);
  }

   deletePsicologo(id: string){
    return this.psicologosCollection.doc(id).delete();
  }


}
