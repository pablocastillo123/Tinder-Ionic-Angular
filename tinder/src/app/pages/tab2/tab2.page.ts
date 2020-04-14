import { SwipeService } from './../../services/swipe.service';
import { LikeService } from './../../services/like.service';
import { Component, OnInit, SimpleChange } from '@angular/core';
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

  user_pic = []

  gente = [] 

  objecto = {
    id: '',
    email: '',
    name : '',
    age : 0,
    image : '',
    visible: true
    }

  array_final = []

  likes = []
  
  constructor(private fcm : FCM, private http : HttpClient, private userfirebase : UserfirebseService, private SwipeService:SwipeService,
    private LikeService:LikeService, private imagefirebase : ImageFirebaseService, private loadingController:LoadingController) {
  }

  
  async ngOnInit () {

    this.LikeService.getLikeCollection().subscribe(res => {
      this.likes = res
    })
    
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

            console.log("ESTE ES EL FILTER ", this.user_login)

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
            // console.log("Este es la people", this.people)
          if(image_firebase[j].id_usuario === this.people[i].email && image_firebase[j].file_path === 'perfil'){
            console.log(this.people[i].name,this.people[i])
            // console.log("Esta es su imagen ", image_firebase[j].url )
            // console.log('Esta es la gente ', this.gente)  

            this.objecto = {
              id: this.people[i].id,
              email: this.people[i].email,
              name : this.people[i].name,
              age : this.people[i].age,
              image : image_firebase[j].url,
              visible: true
             }

            this.gente.push(this.objecto)

            // console.log("Esta es el objecto", this.objecto)
            // console.log("Esta es el array", this.gente)

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

            for (let i = 0; i < this.likes.length; i ++ ) {

              for (let j = 0; j < this.likes.length; j++) {

                if(this.likes[i].id_from_user === this.likes[j].id_to_user && this.likes[j].id_from_user === this.likes[i].id_to_user && this.user_login.id === this.likes[j].id_to_user ) {

                  console.log("ESTOS SON LOS ID", this.likes[i].id_from_user)
                  console.log("ESTOS SON LOS ID", this.likes[i].id_to_user)
                  
                }

              }  
        }

    })

    // this.http.post(this.url, this.body , this.httpOptions).subscribe(res => {
    //   console.log("Esta es la respuesta", res)
    // })

    // loading.dismiss()


  }




  async swiped (event , index) {

    console.log('LA IMAGEN DEL USUARIO', this.user_pic)


    if(event) {

      this.gente.splice(index, 1)
      console.log("LA GENTE AHORA", this.gente)
      console.log(this.gente[index].name + ' people visible is ' + this.gente[index].visible)
      // this.userfirebase.updateSwipeUser(this.people[index])
      this.LikeService.setLikeUser(this.gente[index], this.user_login)
      this.SwipeService.setSwipeUser(this.user_login, this.gente[index])

    } else {

     
      this.SwipeService.setSwipeUser(this.user_login, this.gente[index])
      this.gente.splice(index, 1)
      console.log("LA GENTE AHORA", this.gente)

    }

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

    console.log('goLeft '+this.gente[this.gente.length -1].name + ' people visible is ' + this.gente[this.gente.length -1].visible)

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


      console.log(this.people[this.gente.length -1].name + ' people visible is ' + this.people[this.gente.length -1 ].visible)
      this.userfirebase.updateSwipeUser(this.people[this.gente.length-1])
      this.LikeService.setLikeUser(this.people[this.gente.length-1], this.user_login)
      this.SwipeService.setSwipeUser(this.user_login, this.gente[this.gente.length-1])

      this.gente.splice(this.gente.length -1, 1)
      console.log("LA GENTE AHORA", this.gente)

    // loading.dismiss()
  }
}

