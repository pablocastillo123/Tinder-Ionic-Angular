import { LikeService } from './../../services/like.service';
import { Component } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'

import { MatchService } from '../../services/match.service'

import { UserfirebseService } from '../../services/userfirebse.service'

import { ImageFirebaseService } from '../../services/image-firebase.service'



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
    email : '',
    name: '',
    imagen : ''
  }

  gente = []

  constructor(private db: AngularFirestore, private matchService :MatchService, private userfirebase : UserfirebseService,
    private imagefirebase: ImageFirebaseService  ) {}

  ngOnInit() {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    this.matchService.getMatchCollection().subscribe(res => {
      this.matches = res
      this.final = this.matches.filter(elemento => {
        return elemento.id_from_user == this.user_login.id || elemento.id_to_user == this.user_login.id
      })
      this.pushPeople();
      this.pushGente()
    })

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


  pushGente () {
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
              email: this.people[i].email,
              name: this.people[i].name,
              imagen : this.user_profile[j].url
            }
            
  
            this.gente.push(this.objeto)
  
          }
  
        }
      }
      console.log(this.gente ,"GENTE")
      window.localStorage.setItem('matches',JSON.stringify(this.gente))


    })
  }


}


