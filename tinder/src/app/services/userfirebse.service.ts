import { userInterface } from './../interface/user';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserfirebseService {

  private user_collection: AngularFirestoreCollection<userInterface>;
  private user: Observable<userInterface[]>;

  constructor(private db:AngularFirestore) {
    this.user_collection = this.db.collection<userInterface>('usuario')

    this.user = this.user_collection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          return {...data}
        })
      }
    ))

  }

  getUserCollection(){
    return this.user
  }

}
