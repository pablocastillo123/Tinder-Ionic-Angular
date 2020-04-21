import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { } from '../../services/match.service'

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chat_id = null

  matches;

  userMatch = []

  result

  mensaje;

  user_login

  mensajes_todos = []


  constructor(private route : ActivatedRoute, private router: Router, private afDB : AngularFireDatabase) { }

  ngOnInit() {
    
    this.userMatch = JSON.parse(window.localStorage.getItem('matches'))

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    console.log("LOGEADO", this.user_login)

    this.chat_id = this.route.snapshot.params['id']

    console.log("ESTE ES EL CHAT", this.chat_id)

    console.log("USER MATCH", this.userMatch)

    this.result = this.userMatch.find(element => {
      return element.id_Match == this.chat_id
    })

    console.log("RESULTADO", this.result)

    this.getMessages()


  }

  goBack () {
    this.router.navigateByUrl('tabs/tab3')
  }

  sendMessage () {
    console.log("TEXTO", this.mensaje)
    this.afDB.list('Mensajes/' + this.chat_id + '/' ).push({
      idUser : this.user_login.id,
      text: this.mensaje,
      date : new Date().toISOString()
    });
    this.mensaje = ""

  }

  getMessages (){
    this.afDB.list('Mensajes/' + this.chat_id + '/' ).snapshotChanges(['child_added']).subscribe(res => {
        this.mensajes_todos = []
        res.forEach(action => {
          console.log("TEXTO", action.payload.exportVal().text)
          this.mensajes_todos.push({
            text: action.payload.exportVal().text,
            idUser : action.payload.exportVal().idUser,
            date : action.payload.exportVal().date
          })
        })

        console.log("MENSAJES ", this.mensajes_todos)
      }
    )

  }

  


}
