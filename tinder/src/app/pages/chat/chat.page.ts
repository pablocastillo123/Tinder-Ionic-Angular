import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireDatabase } from '@angular/fire/database';

import { ImageFirebaseService  } from '../../services/image-firebase.service'

import { Camera } from '@ionic-native/camera/ngx';

import { PopoverController, IonContent } from '@ionic/angular';

import { PopoverComponent } from '../../components/popover/popover.component'

import { RealtimeService } from '../../services/realtime.service'



@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('content', {static: false}) content: IonContent;


  chat_id = null

  matches;

  userMatch = []

  result

  mensaje = ''

  user_login

  mensajes_todos = []

  size = 10
  img_base64: any;
  image: string;


  constructor(private route : ActivatedRoute, private router: Router, private afDB : AngularFireDatabase, 
    private imageService : ImageFirebaseService, private camera:Camera,
    public popoverController: PopoverController, private realTime : RealtimeService) { }

    


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

  scrollToBottomOnInit(time) {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
          this.content.scrollToBottom(400);
      }
  }, time);
  }



  sendMessage () {

    var today = new Date();

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    var time = today.getHours() + ":" + today.getMinutes()

    console.log("TEXTO", this.mensaje)

    this.realTime.sendMessague(this.chat_id, this.user_login.id, this.mensaje, date, time);

    
    this.mensaje = ""
    this.scrollToBottomOnInit(500)


    this.realTime.updateMessagues(this.chat_id)
  }

  getMessages (){

    this.realTime.getMessages(this.chat_id).subscribe(res => {
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
        this.scrollToBottomOnInit(1500)
    })

  }

  sendPhoto () {

    this.camera.getPicture({

      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 1024,
      targetWidth: 1024,
      correctOrientation: true,
      saveToPhotoAlbum: true
        
    }).then(res =>{
      let base64 = 'data:image/jpeg;base64,' + res
      this.img_base64 = res
      this.image = base64

      //Agregar en el servicio
      this.imageService.saveImageInChat(this.user_login.email, this.img_base64, 'conversaciones', this.chat_id, this.user_login.id)
      console.log("Se ha enviado la foto")

    }).catch(err =>{
      console.log(err)
    })

    this.scrollToBottomOnInit(500)    

  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      
    });
    return await popover.present();
  }

  


}

