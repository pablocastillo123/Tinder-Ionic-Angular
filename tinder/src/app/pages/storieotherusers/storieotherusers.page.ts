import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController, IonSlides } from '@ionic/angular';

import { ImageFirebaseService } from '../../services/image-firebase.service'

@Component({
  selector: 'app-storieotherusers',
  templateUrl: './storieotherusers.page.html',
  styleUrls: ['./storieotherusers.page.scss'],
})
export class StorieotherusersPage implements OnInit {

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

  private user

  private stories_user = []

  currentIndex = 0


  constructor(private navParams: NavParams,  private imagefirebase : ImageFirebaseService,  private modalCtrl : ModalController ) { }

  ngOnInit() {

    this.user = this.navParams.get('user')
    console.log("INFO DEL USER", this.user)
    console.log("METODODDD", this.navParams.get('metodo'))

    
    this.imagefirebase.getImageCollection().subscribe(res => {
      
      this.stories_user = res.filter(elemento => {
       return elemento.file_path === 'stories' && elemento.id_usuario === this.user.email
     })
     console.log("Historias obtenidas", this.stories_user)
   
   })

  }

  goBack() {
    this.modalCtrl.dismiss()
  }

  ionSlideWillChange () {
    this.slides.getActiveIndex().then(index => {
      console.log("INDEX", index)
      console.log('currentIndex:', index);
      this.currentIndex = index
    })
   
    console.log("EVENTO", event)  
  }

  nextStoryItem () {
    this.slides.slideNext()
    console.log("CURRENT", this.currentIndex)
    
    if( this.currentIndex  === this.stories_user.length -1 ) {
      this.modalCtrl.dismiss()
    }
    // this.ionSlideWillChange()
    console.log("HOLAA")
  }

}
