import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import { UtilToolService } from './utiltool.service';

@Injectable({
  providedIn: 'root'
})
export class SwipeService {

  constructor(private UtilToolService:UtilToolService, private db:AngularFirestore) { }

  setSwipeUser(from_user,to_user){
    let id_swipe = this.UtilToolService.generateId()

    this.db.collection('swipe').doc(from_user.id)
    .collection(`swipe-${from_user.email}`)
    .doc(id_swipe).set({
      id_swipe: id_swipe,
      id_from_user: from_user.id,
      id_to_user: to_user.id,
    })
  }

  getSwipeUser(from_user){
    return this.db.collection('swipe').doc(from_user.id).collection(`swipe-${from_user.email}`).get()
  }

}
