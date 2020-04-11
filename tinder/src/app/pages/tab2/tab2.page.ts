import { Component, OnInit } from '@angular/core';

import { FCM } from '@ionic-native/fcm/ngx';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserfirebseService } from '../../services/userfirebse.service'

import { ImageFirebaseService } from '../../services/image-firebase.service'

import { userInterface } from '../../interface/user'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // url = 'https://fcm.googleapis.com/fcm/send';

  // body = {
  //   "notification": {
  //     "title" : "Pablo es marico",
  //     "body": "Este mensaje lo envie desde el metodo post"
  //   }, 
  //   "to" : "fcd1_52frkg:APA91bGWPNkZ5ZHnVWesiUTl7KPRs8IaE2smdfonTjSHVJZF6525IVYBftJ3hEmu6iMDH16HicsEdL8311wQ30s9mZu4mkw51PEGrjQYHGTIs5VimxWYx9xrf8A1z-46xA8vtstQkc5n"
  // }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type' : 'application/json',
  //     'Authorization' : 'key=AAAAbX3ephE:APA91bEXNAd8DjERzfrEYzOZQdd9Op8Sscu4x-7zxwClBobgTlDZpeD-FlzCzSEz5ctf_g8jeEb3uEvRAv1nIhLofDL0BpPJXBMnmoTtUJn-9o-Rxcl4_A4fc7XVu8_2v4Y2_FxcdeEU'
  //   })
  // }

  currentIndex : number

  people : userInterface[] = []

  gente = [] 

  objecto = {
    name : '',
    age : 0,
    image : '',
    visible : true
  }
  
  constructor(private fcm : FCM, private http : HttpClient, private userfirebase : UserfirebseService,
    private imagefirebase : ImageFirebaseService) {
    this.currentIndex = this.people.length - 1;
    console.log(this.currentIndex)
  }

  ngOnInit () {
    this.fcm.getToken().then(token => {
      console.log("Token: ", token)
    });

    this.userfirebase.getUserCollection().subscribe(res => {
      console.log("Esta es la respuesta" , res)
      this.people = res;
    })

    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{
      for(var i=0; i<image_firebase.length; i++){
        for (var j =0; j < this.people.length; j++) {
          console.log("Este es la people", this.people)
        if(image_firebase[i].id_usuario === this.people[j].email && image_firebase[i].file_path === 'perfil'){
              console.log("Este es el correo ", this.people[j])
              console.log("Esta es su imagen ", image_firebase[i].url )

               console.log('Esta es la gente ', this.gente)

               this.objecto = {
                name : this.people[j].name,
              
                age : this.people[j].age,
 
                image : image_firebase[i].url,
 
                visible : this.people[j].visible,
               }

               this.gente.push(this.objecto)
    
              console.log("Esta es el objecto", this.objecto)

              console.log("Esta es el array", this.gente)

          break;
        }
        }
        
      }
    })

    // this.http.post(this.url, this.body , this.httpOptions).subscribe(res => {
    //   console.log("Esta es la respuesta", res)
    // })
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





