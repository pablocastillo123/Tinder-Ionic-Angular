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

  constructor(private fcm : FCM, private userfirebase : UserfirebseService, private SwipeService:SwipeService,
    private LikeService:LikeService, private imagefirebase : ImageFirebaseService, private http : HttpClient,
    private notification : NotificationService, private MatchService:MatchService) {
  }

  ngOnInit () {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    const result = this.fcm.subscribeToTopic(this.user_login.id)

    this.LikeService.getLikeCollection().subscribe(res => {
      this.likes = res
    })
  
    // this.fcm.getToken().then(token => {
    //   console.log("Token: ", token)
    // });

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
      let filter = this.people.filter(person =>{
        return person.name != this.user_login.name
      })

      //filtrando la consulta de firebase para que no salga el sexo del usuario logeado
      let array_sexo = filter.filter(sexo => {
        return sexo.sexo != this.user_login.sexo
      })

      this.people = []
      this.people.push(...array_sexo)

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

      
      const results = this.gente.filter(({ id: id1 }) => 
            
      !this.swipe_user.some(({ id_to_user : id2 }) => id2 === id1));

      this.gente = []
      this.gente.push(...results)
      this.currentIndex = this.people.length - 1;

    })
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
        const likeotheruser = this.likes.filter(elemento => {
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
}
