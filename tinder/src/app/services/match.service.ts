import { matchInterface } from './../interface/match';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private match_collection: AngularFirestoreCollection<matchInterface>;
  private match: Observable<matchInterface[]>;

  constructor(private db:AngularFirestore) {
    this.match_collection = this.db.collection<matchInterface>('match')

    this.match = this.match_collection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          return {...data}
        })
      }
    ))

  }

  getMatchCollection(){
    return this.match
  }
}
