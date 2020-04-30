import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { ImageFirebaseService } from '../../services/image-firebase.service'

import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-storieview',
  templateUrl: './storieview.page.html',
  styleUrls: ['./storieview.page.scss'],
})
export class StorieviewPage implements OnInit {

  @ViewChild(IonSlides,  {static: false}) slides : IonSlides


  stories_user = []

  user_login

  profile_pic

  currentIndex = 0

  previousIndex = []



  constructor(private navParams: NavParams, private imagefirebase : ImageFirebaseService ) { }

  ngOnInit() {

    console.log(this.navParams.data, "La dataa");
    this.user_login = this.navParams.get('user_login')
    console.log("INFO DEL USER", this.user_login)

    this.imagefirebase.getImageCollection().subscribe(res => {
      this.profile_pic = res.find(elemento => {
        return elemento.file_path === 'perfil' && elemento.id_usuario === this.user_login.email
      })
      console.log("PROFILE PIC", this.profile_pic)
    })

    this.imagefirebase.getImageCollection().subscribe(res => {
      
      this.stories_user = res.filter(elemento => {
       return elemento.file_path === 'stories' && elemento.id_usuario === this.user_login.email
     })
     console.log("Historias obtenidas", this.stories_user)
   
   })

    

  }


  ionSlideWillChange (event) {

    this.slides.getPreviousIndex().then(index => {
      console.log("ANTERIOR", index)
      this.previousIndex[index] = index
      console.log("LOS ANTERIORES", this.previousIndex)
    })

    this.slides.getActiveIndex().then(index => {
      console.log("INDEX", index)
      console.log('currentIndex:', index);
      this.currentIndex = index
    })

   

    console.log("EVENTO", event)    
  }

  getActiveIndex (evento) {
    
  }


}
