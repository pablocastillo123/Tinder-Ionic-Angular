import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList  } from '@angular/fire/database';




@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  item : AngularFireList<any>

  constructor( private afDB : AngularFireDatabase) { }


  sendMessague (chat_id, user_login, mensaje, date, time) {

    this.afDB.list('Mensajes/' + chat_id + '/' ).push({
      idUser : user_login,
      text: mensaje,
      date : {
        dia : date,
        hora : time
      } 
    });
  }

  getMessages (chat_id) {

    return this.afDB.list('Mensajes/' + chat_id + '/' ).snapshotChanges(['child_added'])
  
  }

  updateMessagues (chat_id) {
  

}
