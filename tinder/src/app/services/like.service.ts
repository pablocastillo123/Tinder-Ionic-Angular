import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { likeInterface } from './../interface/like';


@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private like_collection: AngularFirestoreCollection<likeInterface>;
  private like: Observable<likeInterface[]>;

  constructor(private db:AngularFirestore) {
    this.like_collection = this.db.collection<likeInterface>('like')

    this.like = this.like_collection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          return {...data}
        })
      }
    ))
  }

  getUserCollection(){
    return this.like
  }
}
