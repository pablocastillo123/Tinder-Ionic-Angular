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

import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  private user_login:userInterface;
  private currentIndex : number
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
  private results =[]
  private user_coord = []

  private array_sexo = []

  private filter = []

  private km = 0

  private kilometros = []

  constructor(private fcm : FCM, private userfirebase : UserfirebseService, private SwipeService:SwipeService,
    private LikeService:LikeService, private imagefirebase : ImageFirebaseService, private http : HttpClient,
    private notification : NotificationService, private MatchService:MatchService, private navCtrl : NavController) {
  }

  ngOnInit () {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    console.log("PRIMERA VEZ", this.user_login)

    this.fcm.subscribeToTopic(this.user_login.id)

    this.LikeService.getLikeCollection().subscribe(res => {
      this.likes = res
    })
  
 

    this.SwipeService.getSwipeUser(this.user_login).subscribe(res =>{
      res.forEach(element =>{
        this.swipe_user.push(element.data())
      })
    })

    this.userfirebase.getUserCollection().subscribe(res => {

      this.people = res
      this.gente = []
      this.currentIndex = 0
      
      //filtrando la consulta de firebase para que el usario que esta logeado no salga
      this.filter = this.people.filter(person =>{
        return person.name != this.user_login.name
      })

      //filtrando la consulta de firebase para que no salga el sexo del usuario logeado
      this.array_sexo = this.filter.filter(sexo => {
        return sexo.sexo != this.user_login.sexo
      })

      //filtrando la consulta de firebase para que salgan los usuarios con el match por localizacion
      this.user_coord = this.array_sexo.filter(user =>{
        this.km = this.getDistanceFromLatLonInKm(this.user_login.latitud,this.user_login.longitud,user.latitud,user.longitud)
        console.log(`km:${this.km}----${user.email} lat:${user.latitud}--long:${user.longitud}`)
        this.kilometros.push(this.km)
        return this.km <= this.user_login.rango || (user.latitud == 0 && user.longitud == 0);
      })


      this.people = []
      this.people.push(...this.user_coord)
      console.log(this.people)
    })

    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{

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
            
            //asignacion de los datos que se mostraran en el card
            this.gente.push(this.objecto)

            break;
          }
        }
      }

      
      this.results = this.gente.filter(({ id: id1 }) => 
            
      !this.swipe_user.some(({ id_to_user : id2 }) => id2 === id1));

      this.gente = []
      this.gente.push(...this.results)
      this.currentIndex = this.people.length - 1;


    })

   
  }

  ionViewWillEnter () {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))
    
    this.SwipeService.getSwipeUser(this.user_login).subscribe(res =>{
      res.forEach(element =>{
        this.swipe_user.push(element.data())
      })
      console.log("ESTOS SON LOS SWIPE", this.swipe_user)

      this.LikeService.getLikeCollection().subscribe(res => {
        this.likes = res
      })
    
      this.userfirebase.getUserCollection().subscribe(res => {
  
        this.people = res
        this.gente = []
        this.currentIndex = 0
        
        //filtrando la consulta de firebase para que el usario que esta logeado no salga
        this.filter = this.people.filter(person =>{
          return person.name != this.user_login.name
        })
  
        //filtrando la consulta de firebase para que no salga el sexo del usuario logeado
        this.array_sexo = this.filter.filter(sexo => {
          return sexo.sexo != this.user_login.sexo
        })
  
        //filtrando la consulta de firebase para que salgan los usuarios con el match por localizacion
        this.user_coord = this.array_sexo.filter(user =>{
           this.km = this.getDistanceFromLatLonInKm(this.user_login.latitud,this.user_login.longitud,user.latitud,user.longitud)
          console.log(`km:${this.km}----${user.email} lat:${user.latitud}--long:${user.longitud}`)
          return this.km <= this.user_login.rango || (user.latitud == 0 && user.longitud == 0);
        })
  
        this.people = []
        this.people.push(...this.user_coord)
        console.log(this.people, "PEOPLE")
      })
  
      this.imagefirebase.getImageCollection().subscribe(image_firebase =>{
  
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
              
              //asignacion de los datos que se mostraran en el card
              this.gente.push(this.objecto)
  
              break;
            }
          }
        }
  
        
        this.results = this.gente.filter(({ id: id1 }) => 
              
        !this.swipe_user.some(({ id_to_user : id2 }) => id2 === id1));
  
        this.gente = []
        this.gente.push(...this.results)
        this.currentIndex = this.people.length - 1;
  
      })
  


    })

    console.log("SEGUNDA VEZ", this.user_login)
  

    

    

    
  }

  async swiped (event , index) {

    if(event) {

      let user_id = this.gente[index]
      let likes = []

      //se guarda el like y se hace una consulta a firebase
      this.LikeService.setLikeUser(this.gente[index], this.user_login)
      this.LikeService.getLikeCollection().subscribe( res => {
        likes = res
      })
   
      setTimeout(() => {
  
        //filtrando la consulta de firebase de los likes que son del usuario
        //que esta logeado
        const likesuser = this.likes.filter(elemento => {
          return elemento.id_from_user === this.user_login.id
        })

        //filtrando la consulta de firebase de los likes que son del usuario
        //al que se esta haciendo swipe
        const likeotheruser = likesuser.filter(elemento => {
          return elemento.id_to_user === user_id.id
        })
  
        for(let i = 0; i < this.likes.length; i++ ) {
  
          //verificacion de like si hay una coincidencia hay match
          if(likeotheruser[0].id_from_user === this.likes[i].id_to_user 
            &&  likeotheruser[0].id_to_user === this.likes[i].id_from_user) {
  
            //se guarda el match y se envia una notifiacion a los usuarios
            this.MatchService.setMatch(likeotheruser[0].id_from_user , this.likes[i].id_from_user)
            this.notification.sendNotification('Tinder', 'Tienes un nuevo Match', likeotheruser[0].id_from_user , this.likes[i].id_from_user)
          }
        }
      }, 2000);
    }

    //se guarda el swipe en firebase 
    this.SwipeService.setSwipeUser(this.user_login, this.gente[index])
    this.gente.splice(index, 1)
  }

  async goLeft () {
    this.SwipeService.setSwipeUser(this.user_login, this.gente[this.gente.length -1])
    this.gente.splice(this.gente.length -1, 1)
  }

  async goRight () {
    
    let user_id = this.gente[this.gente.length - 1]
    let likes = []

    //se guarda el like y se hace una consulta a firebase
    this.LikeService.setLikeUser(this.gente[this.gente.length-1], this.user_login)
    this.LikeService.getLikeCollection().subscribe( res => {
      likes = res
    })
 
    setTimeout(() => {

      //filtrando la consulta de firebase de los likes que son del usuario
      //que esta logeado
      const likesuser = this.likes.filter(elemento => {
        return elemento.id_from_user === this.user_login.id
      })

      //filtrando la consulta de firebase de los likes que son del usuario
      //al que se esta haciendo swipe
      const likeotheruser = this.likes.filter(elemento => {
        return elemento.id_to_user === user_id.id
      })

      for(let i = 0; i < this.likes.length; i++ ) {

        //verificacion de like si hay una coincidencia hay match
        if(likeotheruser[0].id_from_user === this.likes[i].id_to_user 
          &&  likeotheruser[0].id_to_user === this.likes[i].id_from_user) {

          //se guarda el match y se envia una notifiacion a los usuarios
          this.MatchService.setMatch(likeotheruser[0].id_from_user , this.likes[i].id_from_user)
          this.notification.sendNotification('tinder', 'Tienes un nuevo Match', likeotheruser[0].id_from_user , this.likes[i].id_from_user)
        }
      }
    }, 2000);

    //se guarda el swipe en firebase 
    this.SwipeService.setSwipeUser(this.user_login, this.gente[this.gente.length-1])
    this.gente.splice(this.gente.length -1, 1)
  }


  ionViewDidLeave () {

    this.people = []
    this.gente = []
    // this.km = 0
    // this.user_pic = []
    // this.user_coord = []
    // this.filter = []
    // this.array_sexo = []
    // this.results = []
    // this.likes = []
    // this.swipe_user = []
    // this.objecto = {
    //   id: '',
    //   email: '',
    //   name : '',
    //   age : 0,
    //   image : '',
    //   visible: true
    // }
    
    this.fcm.unsubscribeFromTopic(this.user_login.id)
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
       
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

}