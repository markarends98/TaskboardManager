import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from '../../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userRef: AngularFirestoreCollection;

  constructor(
    private afs: AngularFirestore,
  ) {
    this.userRef = afs.collection('users');
  }

  getUsers() {
    return this.userRef
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...(data as object) } as User;
        }))
      );
  }

  getUser(id: string) {
    return this.userRef.doc(id).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data();
        const uid = actions.payload.id;
        return { uid, ...(data as object) } as User;
      })
    );
  }
}
