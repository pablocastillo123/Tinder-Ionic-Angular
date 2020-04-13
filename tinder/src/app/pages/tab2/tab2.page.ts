import { SwipeService } from './../../services/swipe.service';
import { LikeService } from './../../services/like.service';
import { Component, OnInit } from '@angular/core';
import { UserfirebseService } from '../../services/userfirebse.service'
import { ImageFirebaseService } from '../../services/image-firebase.service'
import { userInterface } from '../../interface/user'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  private currentIndex : number
  private user_login:userInterface;
  private swipe_user = []
  private people : userInterface[] = []
  private gente = [] 

  private objecto = {
    id: '',
    name : '',
    age : 0,
    image : '',
    visible : true
  }
  
  constructor(private userfirebase : UserfirebseService, private SwipeService:SwipeService,
    private LikeService:LikeService, private imagefirebase : ImageFirebaseService) {
  }
  
  async ngOnInit () {
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
      this.gente = []
      this.currentIndex = 0
      
      //Codigo para que el usario que esta logeado no salga en los cards
      let filter = this.people.filter(person =>{
        return person.id != this.user_login.id
      })
  
      this.people = []
      this.people.push(...filter)
      this.currentIndex = this.people.length -1;
  
      console.log('filter people',this.people)
    
      
    })

  
    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{
      for(var i=0; i<this.people.length; i++){
        for (var j =0; j < image_firebase.length; j++) {
          if(image_firebase[j].id_usuario === this.people[i].email && image_firebase[j].file_path === 'perfil'){

            this.objecto = {
              id: this.people[i].id,
              name : this.people[i].name,
              age : this.people[i].age,
              image : image_firebase[j].url,
              visible : true,
            }

            this.gente.push(this.objecto)

            break;
          }
        }
      }

      console.log("ESTA ES LA GENTE", this.gente)

      for (let i = 0; i < this.swipe_user.length; i++) {
        for (let j = 0; j < this.gente.length; j ++) {
          if(this.swipe_user[i].id_to_user === this.gente[j].id) {
            
            console.log("Este es el visible del user", this.swipe_user[i].visible_to_user)
            this.gente[j].visible = false
            this.currentIndex --

          } 
        }
      } 

      console.log('currentIndex',this.currentIndex)

      console.log("ESTA ES LA GENTE MODIFICADA" , this.gente)
    })

  }

  async swiped (event , index) {
    if(event) {

      this.gente[index].visible = false

      console.log(this.people[index].name + '  swipe is ' + event)
      this.userfirebase.updateSwipeUser(this.people[index])
      this.LikeService.setLikeUser(this.people[index], this.user_login)
      this.SwipeService.setSwipeUser(this.user_login, this.gente[index])
      this.currentIndex --
      console.log(' currentIndex',this.currentIndex)


    } else {
      this.gente[index].visible = false

      this.SwipeService.setSwipeUser(this.user_login, this.gente[index])

      this.currentIndex --
      console.log(' currentIndex',this.currentIndex)


    }

  }

  async goLeft () {
    this.gente[this.currentIndex].visible = false
    console.log('goLeft '+this.people[this.currentIndex].name + ' swipe is flase')
    
    this.SwipeService.setSwipeUser(this.user_login, this.gente[this.currentIndex])

    this.currentIndex --
    console.log('goleft currentIndex',this.currentIndex)
  }

  async goRight () {
    this.gente[this.currentIndex].visible = false
    console.log('goRight '+this.people[this.currentIndex].name + ' swipe is true')

    this.LikeService.setLikeUser(this.people[this.currentIndex], this.user_login)
    this.SwipeService.setSwipeUser(this.user_login, this.gente[this.currentIndex])

    this.currentIndex --
    console.log('goright currentIndex',this.currentIndex)
  }
}

