import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { ImageFirebaseService  } from '../../services/image-firebase.service'
import { Camera } from '@ionic-native/camera/ngx';
import { PopoverController, IonContent } from '@ionic/angular';
import { PopoverComponent } from '../../components/popover/popover.component'
import { RealtimeService } from '../../services/realtime.service'
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('content', {static: false}) content: IonContent;

  public chat_id = null

  public matches;

  public userMatch = []

  public result

  public mensaje = ''

  public user_login

  public mensajes_todos = []

  public size : number = 10

  public img_base64: any;

  public image: string;

  constructor(private route : ActivatedRoute, private router: Router, private afDB : AngularFireDatabase, 
    private NotificationService:NotificationService,
    private imageService : ImageFirebaseService, private camera:Camera,
    public popoverController: PopoverController, private realTime : RealtimeService,
    public viewer : PhotoViewer, public platform : Platform) {
    }

  ngOnInit() {

    this.userMatch = JSON.parse(window.localStorage.getItem('matches'))

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    this.chat_id = this.route.snapshot.params['id']

    this.result = this.userMatch.find(element => {
      return element.id_Match == this.chat_id
    })


    this.getMessages()
  }


  goBack () {
    this.router.navigateByUrl('tabs/tab3')
  }

  //Metodo creado para que cuando el usuario envie un mensaje, el scroll baje, y para el inicio del chat
  scrollToBottomOnInit(time) {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(400);
      }
    }, time);
  }

  sendMessage () {

    //Se obtiene para saber la fecha actual y asi enviarlo en la base de datoss
    let today = new Date();

    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    let time = today.getHours() + ":" + today.getMinutes()


    this.realTime.sendMessague(this.chat_id, this.user_login.id, this.mensaje, date, time);

    
    this.mensaje = ""
    this.scrollToBottomOnInit(500)

    this.NotificationService.sendNotificationChat('Tinder',`Tienes un mensaje de ${this.user_login.name}`,this.result.token_notification)


  }

  getMessages (){

    this.realTime.getMessages(this.chat_id).subscribe(res => {
      this.mensajes_todos = []
        res.forEach(action => {
          this.mensajes_todos.push({
            text: action.payload.exportVal().text,
            idUser : action.payload.exportVal().idUser,
            date : action.payload.exportVal().date
          })
        })

        this.scrollToBottomOnInit(1500)
    })

  }

  //Ver la foto dentro del chat
  viewpic (foto_url) { 
    this.viewer.show(foto_url) 
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
      componentProps: {id: this.chat_id}
    });
    return await popover.present();
  }

  ionViewDidLeave () {
    this.mensaje = ""
  }

  


}

