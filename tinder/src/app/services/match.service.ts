import { matchInterface } from './../interface/match';
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { UtilToolService } from './utiltool.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private match_collection: AngularFirestoreCollection<matchInterface>;
  private match: Observable<matchInterface[]>;

  constructor(private UtilToolService:UtilToolService,private db:AngularFirestore) {
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

  setMatch(from_user,to_user){
    let id_match = this.UtilToolService.generateId()

    this.db.collection('match').doc(id_match).set({
      id_match: id_match,
      id_from_user: from_user.id,
      id_to_user: to_user.id,
    })
  }

  getMatchCollection(){
    return this.match
  }
}
