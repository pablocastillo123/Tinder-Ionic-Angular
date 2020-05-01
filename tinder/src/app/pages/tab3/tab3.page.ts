import { Component } from '@angular/core';

import { MatchService } from '../../services/match.service'

import { UserfirebseService } from '../../services/userfirebse.service'

import { ImageFirebaseService } from '../../services/image-firebase.service'
import { Router } from '@angular/router';

import { AngularFireDatabase } from '@angular/fire/database';

import { Camera } from '@ionic-native/camera/ngx';

import {  UtilToolService } from '../../services/utiltool.service'
import { ModalController } from '@ionic/angular';

import { StorieviewPage } from '../storieview/storieview.page'

import {  StorieotherusersPage } from '../storieotherusers/storieotherusers.page'


import { StoriesService } from '../../services/stories.service'

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
    last_name:'',
    imagen : '',
    token_notification: ''
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

  user_match_stories = []

  currentLength = 0


  constructor(private matchService :MatchService, private userfirebase : UserfirebseService,
    private imagefirebase: ImageFirebaseService, private router: Router , 
    private afDB : AngularFireDatabase, private camera : Camera, private utilTool : UtilToolService,
    private modalCtrl : ModalController, private storiesService : StoriesService ) {}

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
      setTimeout( () => { 
        console.log("Entraste")

        this.pushPeople();
        this.pushGente()
      }, 2500)
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
              last_name: res[i].last_name,
              imagen : '',
              token_notification: res[i].token_notification
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
    console.log("ABANDONE")

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
              last_name: this.people[i].last_name,
              imagen : this.user_profile[j].url,
              token_notification: this.people[i].token_notification
            }
            
  
            this.gente.push(this.objeto)
  
          }
  
        }
      }

      this.storiesService.getImageCollection().subscribe(res => {
        this.stories_others = res.filter (elemento => {
          return elemento.file_path === 'stories' && elemento.id_usuario != this.user_login.email
        })
        console.log("LAS HISTORIAS DE OTROS", this.stories_others)

       
       

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
        this.currentLength = this.mensajes_todos.length
         
      this.user_match_stories = this.gente.filter(({ email: id1 }) => 
            
      this.stories_others.some(({ id_usuario : id2 }) => id2 === id1));

      console.log("RETORNA LOS QUE TIENEN HISTORIAS", this.user_match_stories)

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
      this.storiesService.saveImg(this.user_login.email, this.img_base64, 'stories', [])
      // this.imagefirebase.saveImg(this.user_login.email, this.img_base64, 'stories', [])
      console.log("Se ha enviado la foto")
      this.ionViewDidLeave()
      this.ionViewWillEnter()


    }).catch(err =>{
      console.log(err)
      this.utilTool.presentAlert('error',err,'ok')
    })

    console.log("Subir historia")

  }

  async obtenerMisHistorias() {

    let modal = await this.modalCtrl.create({
      component : StorieviewPage,
      componentProps: {
       user_login : this.user_login
      } 
    })

    return await modal.present();
  }

  async verHistoria (usuario) {

    console.log(usuario , "INFO DEL USER")

    let modal = await this.modalCtrl.create({
      component : StorieotherusersPage,
      componentProps: {
       user : usuario
     } 

    })

    return await modal.present();

  }

  


 


 




}



