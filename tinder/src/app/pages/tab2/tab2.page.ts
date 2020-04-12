import { SwipeService } from './../../services/swipe.service';
import { LikeService } from './../../services/like.service';
import { Component, OnInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserfirebseService } from '../../services/userfirebse.service'
import { ImageFirebaseService } from '../../services/image-firebase.service'
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { userInterface } from '../../interface/user'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // url = 'https://fcm.googleapis.com/fcm/send';

  // body = {
  //   "notification": {
  //     "title" : "Pablo es marico",
  //     "body": "Este mensaje lo envie desde el metodo post"
  //   }, 
  //   "to" : "fcd1_52frkg:APA91bGWPNkZ5ZHnVWesiUTl7KPRs8IaE2smdfonTjSHVJZF6525IVYBftJ3hEmu6iMDH16HicsEdL8311wQ30s9mZu4mkw51PEGrjQYHGTIs5VimxWYx9xrf8A1z-46xA8vtstQkc5n"
  // }

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type' : 'application/json',
  //     'Authorization' : 'key=AAAAbX3ephE:APA91bEXNAd8DjERzfrEYzOZQdd9Op8Sscu4x-7zxwClBobgTlDZpeD-FlzCzSEz5ctf_g8jeEb3uEvRAv1nIhLofDL0BpPJXBMnmoTtUJn-9o-Rxcl4_A4fc7XVu8_2v4Y2_FxcdeEU'
  //   })
  // }

  currentIndex : number

  private user_login:userInterface;
  private swipe_user = []
  people : userInterface[] = []

  gente = [] 

  objecto = {
    id: '',
    name : '',
    age : 0,
    image : '',
    visible : true
  }
  
  constructor(private fcm : FCM, private http : HttpClient, private userfirebase : UserfirebseService, private SwipeService:SwipeService,
    private LikeService:LikeService, private imagefirebase : ImageFirebaseService, private loadingController:LoadingController) {
  }

  async ngOnInit () {
    
    // const loading = await this.loadingController.create({
    //   message : 'Loading.....',
    // })
    // await loading.present()

    this.user_login = JSON.parse(window.localStorage.getItem('user'))
    console.log(this.user_login)

    this.SwipeService.getSwipeUser(this.user_login).subscribe(res =>{
      res.forEach(element =>{
        this.swipe_user.push(element.data())
      })
    })

    this.userfirebase.getUserCollection().subscribe(res => {
      console.log("usuarios" , res)
      console.log('swipe user', this.swipe_user)

      this.people = res

      //Codigo para que el usario que esta logeado no salga en los cards
            let filter = this.people.filter(person =>{
              return person.name != this.user_login.name
            })
        
            this.people = []
            
            this.people.push(...filter)
        
            console.log('filetr',this.people)
          
    
        console.log("usuarios con el campo visible true" , this.people)
      
        this.currentIndex = this.people.length - 1;
        console.log('currentIndex',this.currentIndex)
      

    })

  
    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{
      for(var i=0; i<this.people.length; i++){
        for (var j =0; j < image_firebase.length; j++) {
            // console.log("Este es la people", this.people)
          if(image_firebase[j].id_usuario === this.people[i].email && image_firebase[j].file_path === 'perfil'){
            console.log(this.people[i].name,this.people[i])
            // console.log("Esta es su imagen ", image_firebase[j].url )
            // console.log('Esta es la gente ', this.gente)  

            this.objecto = {
              id: this.people[i].id,
              name : this.people[i].name,
              age : this.people[i].age,
              image : image_firebase[j].url,
              visible : this.people[i].visible,
            }

            this.gente.push(this.objecto)

            // console.log("Esta es el objecto", this.objecto)
            // console.log("Esta es el array", this.gente)

            break;
          }
        }
      }

      console.log("ESTA ES LA GENTE", this.gente)

      for (let i = 0; i < this.swipe_user.length; i++) {

        for (let j = 0; j < this.gente.length; j ++) {

          if(this.swipe_user[i].id_to_user === this.gente[j].id) {
            
            console.log("Este es el visible del user", this.swipe_user[i].visible_to_user)

           this.gente[j].visible = this.swipe_user[j].visible_to_user

          } 

        }
      } 

      console.log("ESTA ES LA GENTE MODIFICADA" , this.gente)
     
    })

  

    // this.http.post(this.url, this.body , this.httpOptions).subscribe(res => {
    //   console.log("Esta es la respuesta", res)
    // })

    // loading.dismiss()

  }

  async swiped (event , index) {

   
    // const loading = await this.loadingController.create({
    //   message : 'Loading.....',
    // })
    // await loading.present()

    //visible false en el front
    this.gente[index].visible = false
    //visible en la data del user se le pasa el event que contiene si es true o false
    // this.people[index].visible = false

    console.log(this.people[index].name + ' people visible is ' + this.people[index].visible)
    this.userfirebase.updateSwipeUser(this.people[index])
    this.LikeService.setLikeUser(this.people[index], this.user_login)
    this.SwipeService.setSwipeUser(this.user_login, this.gente[index])

    this.currentIndex --

    // loading.dismiss()
  }

  async goLeft () {
    const loading = await this.loadingController.create({
      message : 'Loading.....',
    })
    await loading.present()

    this.gente[this.currentIndex].visible = false
    this.people[this.currentIndex].visible = false

    console.log('goLeft '+this.people[this.currentIndex].name + ' people visible is ' + this.people[this.currentIndex].visible)

    this.userfirebase.updateSwipeUser(this.people)
    this.LikeService.setLikeUser(this.people[this.currentIndex],this.user_login)

    this.currentIndex --

    loading.dismiss()
  }

  async goRight () {
    const loading = await this.loadingController.create({
      message : 'Loading.....',
    })
    await loading.present()

    this.gente[this.currentIndex].visible = false
    console.log('goRight '+this.people[this.currentIndex].name + ' people visible is ' + this.people[this.currentIndex].visible)

    this.userfirebase.updateSwipeUser(this.people[this.currentIndex])
    this.LikeService.setLikeUser(this.people[this.currentIndex],this.user_login)

    this.currentIndex -- 

    loading.dismiss()
  }
}

