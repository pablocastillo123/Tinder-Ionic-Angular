import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { } from '../../services/match.service'

// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


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

  constructor(private route : ActivatedRoute, private router: Router) { }

  ngOnInit() {

    
    this.userMatch = JSON.parse(window.localStorage.getItem('matches'))

    this.chat_id = this.route.snapshot.params['id']

    console.log("ESTE ES EL CHAT", this.chat_id)

    console.log("USER MATCH", this.userMatch)

    this.result = this.userMatch.find(element => {
      return element.id_Match == this.chat_id
    })

    console.log("RESULTADO", this.result)


  }

  goBack () {
    this.router.navigateByUrl('tabs/tab3')
  }

  sendMessage () {
    console.log("TEXTO", this.mensaje)
    this.mensaje = ""

  }

  


}
