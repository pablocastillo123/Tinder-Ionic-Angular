import { MatchService } from './../../services/match.service';
import { SwipeService } from './../../services/swipe.service';
import { LikeService } from './../../services/like.service';
import { Component, OnInit, SimpleChange } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserfirebseService } from '../../services/userfirebse.service'
import { ImageFirebaseService } from '../../services/image-firebase.service'
import { userInterface } from '../../interface/user'

import { NotificationService } from '../../services/notification.service'

import { map } from 'rxjs/operators';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  private user_login:userInterface;

  currentIndex : number

  private swipe_user = []
  private people : userInterface[] = []
  private gente = [] 
  private user_pic = []

  private objecto = {
    id: '',
    email: '',
    name : '',
    age : 0,
    image : '',
    visible: true
  }

  private array_final = []
  private likes = []
  private token

  constructor(private fcm : FCM, private userfirebase : UserfirebseService, private SwipeService:SwipeService,
    private LikeService:LikeService, private imagefirebase : ImageFirebaseService, private http : HttpClient,
    private notification : NotificationService, private MatchService:MatchService) {
  }


 

  
  ngOnInit () {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))
    console.log(this.user_login)

    this.fcm.subscribeToTopic(this.user_login.id)
    const result = this.fcm.subscribeToTopic(this.user_login.id)
    console.log( "resultado", result)

    this.LikeService.getLikeCollection().subscribe(res => {
      this.likes = res
    })

  
     this.fcm.getToken().then(token => {
      console.log("Token: ", token)
    });

    
    
    // const loading = await this.loadingController.create({
    //   message : 'Loading.....',
    // })
    // await loading.present()

    this.SwipeService.getSwipeUser(this.user_login).subscribe(res =>{
      res.forEach(element =>{
        this.swipe_user.push(element.data())
      })
    })

    this.userfirebase.getUserCollection().subscribe(res => {
      console.log("usuarios" , res)
      console.log('swipe user', this.swipe_user)

      this.people = res
      this.gente = []
      this.currentIndex = 0
      
      //filtrando la consulta de firebase para que el usario que esta logeado no salga
      let filter = this.people.filter(person =>{
        return person.name != this.user_login.name
      })

      console.log("ESTE ES EL FILTER ", this.user_login)
      
      //filtrando la consulta de firebase para que no salga el sexo del usuario logeado
      let array_sexo = filter.filter(sexo => {
        return sexo.sexo != this.user_login.sexo
      })

      console.log("RESULT FINAL", array_sexo)

      this.people = []
      this.people.push(...array_sexo)

      console.log('filetr',this.people)
      console.log("usuarios con el campo visible true" , this.people)
      console.log('currentIndex',this.currentIndex)
    })

    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{

      console.log("LA RESPUESTA ", image_firebase)

      this.user_pic = image_firebase.filter(elemento => {
        if(elemento.file_path === 'perfil' ) {
          return elemento.id_usuario === this.user_login.email
        }
      })

      for(var i=0; i<this.people.length; i++){
        for (var j =0; j < image_firebase.length; j++) {
          if(image_firebase[j].id_usuario === this.people[i].email && image_firebase[j].file_path === 'perfil'){

            this.objecto = {
              id: this.people[i].id,
              email: this.people[i].email,
              name : this.people[i].name,
              age : this.people[i].age,
              image : image_firebase[j].url,
              visible: true
            }

            this.gente.push(this.objecto)

            break;
          }
        }
      }

      console.log("ESTA ES LA GENTE", this.gente)

      const results = this.gente.filter(({ id: id1 }) => 
            
      !this.swipe_user.some(({ id_to_user : id2 }) => id2 === id1));

      this.gente = []
      this.gente.push(...results)
      this.currentIndex = this.people.length - 1;

      console.log("ESTO ES SIN LOS QUE TINENE SWIPE", this.gente)
      console.log("LOS LIKES", this.likes)

        //     for (let i = 0; i < this.likes.length; i ++ ) {

        //       for (let j = 0; j < this.likes.length; j++) {

        //         if(this.likes[i].id_from_user === this.likes[j].id_to_user && this.likes[j].id_from_user === this.likes[i].id_to_user && this.user_login.id === this.likes[j].id_to_user ) {

        //           console.log("ESTOS SON LOS ID", this.likes[i].id_from_user)
        //           console.log("ESTOS SON LOS ID", this.likes[i].id_to_user)

        //           this.MatchService.setMatch(this.likes[i].id_from_user,this.likes[i].id_to_user)

        //         }
        //       }  
        // }

    })

    // loading.dismiss()

  }

  
  

  async swiped (event , index) {

    console.log("LIKES ANTES", this.likes)
    console.log('LA IMAGEN DEL USUARIO', this.user_pic)
    console.log("CREO YO", this.gente)
    console.log("ARRELGO ACTUAL", this.gente[this.gente.length-1])
    console.log("ARREGLO ACTUAL", this.gente[index])

    if(event) {

      let user_id = this.gente[index]

      let likes = []

       this.LikeService.setLikeUser(this.gente[index], this.user_login)

      this.LikeService.getLikeCollection().subscribe( res => {

        likes = res

      })

      const likeotheruser = this.likes.filter(elemento => {
        return elemento.id_to_user === user_id.id
      })

      for(let i = 0; i < this.likes.length; i++ ) {

        if(likeotheruser[0].id_from_user === this.likes[i].id_to_user 
          &&  likeotheruser[0].id_to_user === this.likes[i].id_from_user    ) {


            console.log("ITS A MATCH")
            this.MatchService.setMatch(likeotheruser[0].id_from_user , this.likes[i].id_from_user)
            this.notification.sendNotification('tinder', 'Este mensaje lo envie desde el metodo post', likeotheruser[0].id_from_user , this.likes[i].id_from_user)


        }
        console.log("LIKES AHORA", this.likes)
        console.log("LIKES DEL USER", likesuser)

      console.log("LIKES DEL USER AL USUARIO ACTUAL", likeotheruser)
    }, 2000);

  
            
    }

    this.SwipeService.setSwipeUser(this.user_login, this.gente[index])
    this.gente.splice(index, 1)
    console.log("LA GENTE AHORA", this.gente)


    // this.currentIndex --

   
    // const loading = await this.loadingController.create({
    //   message : 'Loading.....',
    // })
    // await loading.present()

    //visible false en el front
    //visible en la data del user se le pasa el event que contiene si es true o false
    // this.people[index].visible = false

    // loading.dismiss()

  }

  

  async goLeft () {
    // const loading = await this.loadingController.create({
    //   message : 'Loading.....',
    // })
    // await loading.present()

    // console.log('goLeft '+this.gente[this.gente.length -1].name + ' people visible is ' + this.gente[this.gente.length -1].visible)

    // this.userfirebase.updateSwipeUser(this.people[this.currentIndex])
    this.SwipeService.setSwipeUser(this.user_login, this.gente[this.gente.length -1])

    this.gente.splice(this.gente.length -1, 1)
    console.log("LA GENTE AHORA", this.gente)
    // loading.dismiss()
  }

  async goRight () {
    // const loading = await this.loadingController.create({
    //   message : 'Loading.....',
    // })
    // await loading.present()


      console.log(this.people[this.gente.length -1].name + ' people visible is ' + this.people[this.gente.length -1 ])
      this.userfirebase.updateSwipeUser(this.people[this.gente.length-1])
      this.LikeService.setLikeUser(this.people[this.gente.length-1], this.user_login)
      this.SwipeService.setSwipeUser(this.user_login, this.gente[this.gente.length-1])

      this.gente.splice(this.gente.length -1, 1)
      console.log("LA GENTE AHORA", this.gente)

    // loading.dismiss()
  }

  ionViewDidLeave () {

    this.fcm.unsubscribeFromTopic(this.user_login.id)
    console.log('SALIO')

  }
}

