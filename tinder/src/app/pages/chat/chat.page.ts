import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chat_id = null

  matches;

  constructor(private route : ActivatedRoute) { }

  ngOnInit() {

    this.chat_id = this.route.snapshot.params['id']


  }


}
