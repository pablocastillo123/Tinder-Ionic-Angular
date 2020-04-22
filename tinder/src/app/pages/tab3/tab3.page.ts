import { LikeService } from './../../services/like.service';
import { Component } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'

import { MatchService } from '../../services/match.service'

import { UserfirebseService } from '../../services/userfirebse.service'

import { ImageFirebaseService } from '../../services/image-firebase.service'
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';



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


  constructor(private db: AngularFirestore, private matchService :MatchService, private userfirebase : UserfirebseService,
    private imagefirebase: ImageFirebaseService, private router: Router  ) {}

  ngOnInit() {

    this.user_login = JSON.parse(window.localStorage.getItem('user'))

    this.matchService.getMatchCollection().subscribe(res => {
      this.matches = res
      this.final = this.matches.filter(elemento => {
        return elemento.id_from_user == this.user_login.id || elemento.id_to_user == this.user_login.id
      })
    })
    setTimeout(() => {
    this.pushPeople();
    this.pushGente()
  }, 3000);


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

    this.router.navigateByUrl('/chat/' + genId)
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
              view : this.people[i].view,
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


