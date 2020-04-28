import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList  } from '@angular/fire/database';




@Injectable({
  providedIn: 'root'
})
export class RealtimeService {


  private dbPath = '/Mensajes/cp3m01t4t281qlrsl7bepdplf55czcuicwdlufhgp2n';

  private customerRef : AngularFireList<any> = null

  constructor( private afDB : AngularFireDatabase) {
    this.customerRef = afDB.list(this.dbPath)
   }


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
    
    
    //Con esto borro
    this.afDB.list('Mensajes/cp3m01t4t281qlrsl7bepdplf55czcuicwdlufhgp2n/-M5eyEVmowWvr9A7kXMh').remove()

    //Con esto edito
    this.afDB.list('Mensajes/' + chat_id + '/').update('-M5fKKZaNy1i6D14tv4h', {holaa: 'sexo'})


}

  deleteMessagues (id) {
    this.afDB.list('Mensajes/' + id).remove()
  }

}
