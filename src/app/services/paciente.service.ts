import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Paciente } from '../interfaces/paciente';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacientesCollection: AngularFirestoreCollection<Paciente>;
  todosPacientes: Array<Paciente>;

  constructor(
    private afs: AngularFirestore,
  ) {
    this.pacientesCollection = this.afs.collection<Paciente>('Pacientes');
  }

  getPacientes() {
    return this.pacientesCollection.snapshotChanges().pipe(
      take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    )
  }

  addPaciente(paciente: Paciente) {
    return this.pacientesCollection.add(paciente);
  }

  getPaciente(id: string) {
    return this.pacientesCollection.doc<Paciente>(id).valueChanges();
  }

  updatePaciente(id: string, paciente: Paciente) {
    return this.pacientesCollection.doc<Paciente>(id).update(paciente);
  }

  deletePaciente(id: string) {
    return this.pacientesCollection.doc(id).delete();
  }

  getPacientesPorCRP(crp: string) {
    return this.afs.collection<Paciente>('Pacientes', ref => ref
      .where('crp', '==', crp))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            return { id, ...data };
          })
        })
      )
  }

  getCodigoProntuario() {
    return this.afs.collection<any>('numerosChaves', ref => ref
      .where('nome', '==', 'codigoProntuario'))
      .snapshotChanges().pipe(
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
