import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { } from '../../services/match.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chat_id = null

  matches;

  userMatch = []

  constructor(private route : ActivatedRoute) { }

  ngOnInit() {

    this.userMatch = JSON.parse(window.localStorage.getItem('matches'))

    this.chat_id = this.route.snapshot.params['id']

    console.log("ESTE ES EL CHAT", this.chat_id)

    console.log("USER MATCH", this.userMatch)

    const result = this.userMatch.filter(element => {
      return element.id_Match == this.chat_id
    })

    console.log("RESULTADO", result)


  }


}
