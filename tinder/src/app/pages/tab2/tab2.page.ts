import { Component, OnInit } from '@angular/core';

import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  token;

  currentIndex : number

  people = [
    {
      name: 'Luis',
      age: 21,
      image: '../../../assets/iconoTinder.svg',
      visible: true
    },
    {
      name: 'Gustavo',
      age: 20,
      image: '../../../assets/kisspng-tinder-computer-icons-tinder-5b47ead292ba08.364455671531439826601.svg',
      visible: true
    },
    {
      name: 'Pablo',
      age: 20,
      image: '../../../assets/c907389646e48bba09604c9d67f9edd3.jpg',
      visible: true
    }
  ]

  constructor(private fcm : FCM) {
    this.currentIndex = this.people.length - 1;
    console.log(this.currentIndex)
  }

  ngOnInit () {
    this.fcm.getToken().then(token => {
      console.log("Token: ", token)
    });
  }

  swiped (event , index) {

    console.log(this.people[index].name + ' swiped ' + event)

    this.people[index].visible = false

    this.currentIndex --

  }

  goLeft () {
    this.people[this.currentIndex].visible = false
    this.currentIndex --
  }

  goRight () {
    this.people[this.currentIndex].visible = true
    this.currentIndex -- 
  }
}





