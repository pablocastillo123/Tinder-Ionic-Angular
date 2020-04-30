import { LikeService } from './../../services/like.service';
import { Component } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'

import { MatchService } from '../../services/match.service'

import { UserfirebseService } from '../../services/userfirebse.service'

import { ImageFirebaseService } from '../../services/image-firebase.service'
import { Router } from '@angular/router';

import { AngularFireDatabase } from '@angular/fire/database';

import { Camera } from '@ionic-native/camera/ngx';

import {  UtilToolService } from '../../services/utiltool.service'
import { ModalController } from '@ionic/angular';

import { StorieviewPage } from '../storieview/storieview.page'







@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  matches = []

  user_login;

  final = []

  people = []

  imagen = []

  user_profile = []

  objeto = {
    id_Match: '',
    id : '',
    view : true,
    email : '',
    name: '',
    imagen : ''
  }

  gente = []

  user_pic;

  anyone;

  mensajes_todos

  lastMessague = []

  img_base64;

  image;

  stories_user = []

  stories_others = []

  final_array = []


  constructor(private db: AngularFirestore, private matchService :MatchService, private userfirebase : UserfirebseService,
    private imagefirebase: ImageFirebaseService, private router: Router , 
    private afDB : AngularFireDatabase, private camera : Camera, private utilTool : UtilToolService,
    private modalCtrl : ModalController ) {}

  ngOnInit() {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    console.log("USER LOGEADO", this.user_login)

    this.imagefirebase.getImageCollection().subscribe(res => {

      this.user_pic = res.find(elemento => {
        return elemento.id_usuario === this.user_login.email && elemento.file_path === 'perfil'
      })

      console.log("RES", this.user_pic)


    })

    this.matchService.getMatchCollection().subscribe(res => {
      this.matches = res
      this.final = this.matches.filter(elemento => {
        return elemento.id_from_user == this.user_login.id || elemento.id_to_user == this.user_login.id
      })
    })

    


  }

  ionViewWillEnter () {
    setTimeout( ( )=> {
      this.people = []
      this.gente = []
      console.log("Entraste")
      this.pushPeople();
      this.pushGente()
     
    }, 500  )
   
  }
  
  pushPeople() {
    this.userfirebase.getUserCollection().subscribe (res => {


      for (let i = 0; i < res.length; i++) {
        for(let j = 0; j < this.final.length; j ++) {
          if(res[i].id === this.final[j].id_from_user  || res[i].id === this.final[j].id_to_user) {
            console.log("ESTE ES EL QUE ESTA ",res[i] )
            console.log("ID MATCHES", this.final[j])

            this.objeto = {
              id_Match : this.final[j].id_match,
              id : res[i].id,
              view : this.final[j].view,
              email : res[i].email,
              name : res[i].name,
              imagen : ''
            }

            this.people.push(this.objeto)
          }

        }
      }
      console.log("LA PEOPLE ", this.people)
    })
  }

  ionViewDidLeave	() {
    this.people = []
    this.gente = []
  }

  goToAnother (genId, index) {

    const match = this.matches.find(element => {
      return element.id_match == genId
    })

    console.log("Este es el match", match)

    if(match.view === false ) {
      match.view = true
      console.log("MATCH AHORA", match)
      this.matchService.updateMatch( match , match.id_match )
    }


    this.gente[index].view = true

    console.log("Esta es la Nueva gente", this.gente)

    this.anyone = this.gente[index]

    console.log("Anyone", this.anyone)

    this.router.navigateByUrl('/chat/' + genId)
  }

  pushGente () {
    console.log("LA gente antes de entrar", this.gente)
    this.imagefirebase.getImageCollection().subscribe(res => {
      this.imagen = res

      this.user_profile = this.imagen.filter(elemento => {
       
          return elemento.id_usuario != this.user_login.email && elemento.file_path === 'perfil'
        
      })

      for(let i = 0; i < this.people.length; i ++) {
        for(let j = 0; j < this.user_profile.length; j ++) {
  
          if( this.people[i].email === this.user_profile[j].id_usuario  ) {
  
            console.log("EL EMAIL", this.people[i])
            console.log("SU URL", this.user_profile[j].url)
  
            this.objeto = {
              id_Match : this.people[i].id_Match,
              id: this.people[i].id,
              view : this.people[i].view,
              email: this.people[i].email,
              name: this.people[i].name,
              imagen : this.user_profile[j].url
            }
            
  
            this.gente.push(this.objeto)
  
          }
  
        }
      }

      this.imagefirebase.getImageCollection().subscribe(res => {
        this.stories_others = res.filter (elemento => {
          return elemento.file_path === 'stories' && elemento.id_usuario != this.user_login.email
        })
        console.log("LAS HISTORIAS DE OTROS", this.stories_others)
        // for(let i = 0; i < this.gente.length; i++) {
        //   for(let j = 0 ; j < this.stories_others.length; j++) {
        //       if(this.gente[i].email === this.stories_others[j].id_usuario ) {

      

        //         const genteObject = {
        //           ...this.gente[i],
        //           id_img : this.stories_others[j].id_img,
        //           name: this.stories_others[j].name,
        //           path: this.stories_others[j].path,
        //           seen: [this.stories_others[j].seen],
        //           type: this.stories_others[j].type,
        //           url: this.stories_others[j].url
        //         }
        //         this.final_array.push(genteObject)
                
        //       }
        //   }
        // }
        // console.log(this.final_array, "FINAL")
      })

      console.log(this.gente ,"GENTE")

      this.anyone = this.gente.find(elemento => {
        return elemento.view == true
      })
      console.log("SON ESTOS", this.anyone)
      this.getLastMessague()
      window.localStorage.setItem('matches',JSON.stringify(this.gente))


    })
  }

  goToMessagues () {
    console.log("MENSAJEs")
  }

  goToStories () {
    console.log("HISTORIAS")
  }

  getLastMessague () {


    for(let i =0; i < this.gente.length; i++) {

      this.afDB.list('Mensajes/' + this.gente[i].id_Match + '/' ).snapshotChanges(['child_added']).subscribe(res => {
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
        this.lastMessague[i] = this.mensajes_todos[this.mensajes_todos.length - 1]
        console.log("LAST MESSAGUE", this.lastMessague)
      }
    )
    } 

      

  }

  subirHistoria () {
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

    }).then(resultado => {

      let base64 = 'data:image/jpeg;base64,' + resultado
      this.img_base64 = resultado
      this.image = base64

      //Guardar foto en firebase
      this.imagefirebase.saveImg(this.user_login.email, this.img_base64, 'stories', [])
      console.log("Se ha enviado la foto")


    }).catch(err =>{
      console.log(err)
      this.utilTool.presentAlert('error',err,'ok')
    })

    console.log("Subir historia")

  }

  async obtenerMisHistorias() {
    //  this.imagefirebase.getImageCollection().subscribe(res => {
      
    //    this.stories_user = res.filter(elemento => {
    //     return elemento.file_path === 'stories' && elemento.id_usuario === this.user_login.email
    //   })
    //   console.log("Historias obtenidas", this.stories_user)
    
    // })

    let modal = await this.modalCtrl.create({
      component : StorieviewPage,
      componentProps: {
       user_login : this.user_login
      } 
    })
    return await modal.present();
   
  }

  verHistoria () {
    console.log("Viendo historiaa")
  }


}


