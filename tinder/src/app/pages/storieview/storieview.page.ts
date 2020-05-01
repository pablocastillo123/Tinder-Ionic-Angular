import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { ImageFirebaseService } from '../../services/image-firebase.service'

import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-storieview',
  templateUrl: './storieview.page.html',
  styleUrls: ['./storieview.page.scss'],
})
export class StorieviewPage implements OnInit {

  @ViewChild(IonSlides,  {static: false}) slides : IonSlides

  @ViewChild("divv", {static: false}) set progressElement(divv: any) {

    if(divv) {


      divv = divv.nativeElement;

      divv.addEventListener("animationend", () => {
        this.nextStoryItem()
      })

      divv.addEventListener("webkitAnimationWend", () => {
        this.nextStoryItem()
      })

    }

  }

  stories_user = []

  user_login

  profile_pic

  currentIndex = 0

  previousIndex = []

  isPaused = false



  constructor(private navParams: NavParams, private imagefirebase : ImageFirebaseService, private route: Router, 
    private modalCtrl : ModalController  ) { }

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


  ionSlideWillChange () {

    this.slides.getActiveIndex().then(index => {
      console.log("INDEX", index)
      console.log('currentIndex:', index);
      this.currentIndex = index
    })
   
    console.log("EVENTO", event)    
  }

  nextStoryItem() {
    this.slides.slideNext()
    console.log("CURRENT", this.currentIndex)
    
    if( this.currentIndex  === this.stories_user.length -1 ) {
      this.modalCtrl.dismiss()
    }
    // this.ionSlideWillChange()
    console.log("HOLAA")
}

  goBack() {
    this.modalCtrl.dismiss()
  }

}
