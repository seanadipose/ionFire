import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private afs: AngularFirestore) { }

  collection$(path, query?) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }));
  }

  doc$(path): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
      })
    );
  }

  updateAt(path: string, data: Object): Promise<any> {
    const segments = path.split('/').filter(v => v);
    // Odd is always a collection
    if (segments.length % 2) return this.afs.collection(path).add(data);
    // Even is always a document
    return this.afs.doc(path).set(data, { merge: true });
  }

  delete(path) {
    return this.afs.doc(path).delete();
  }
}
