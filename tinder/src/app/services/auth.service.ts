import { UtilToolService } from './utiltool.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../shared/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged: any = false;

  constructor(public afAuth: AngularFireAuth, private UtilToolService:UtilToolService) { 
    afAuth.authState.subscribe(user => 
      (this.isLogged = user));
  }

  async onLogin (user:User) {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (error) {
      if(error.code === 'auth/user-not-found'){
        this.UtilToolService.presentAlert('Error','Usuario no encontrado','ok')
      }

      if(error.code === 'auth/wrong-password'){
        this.UtilToolService.presentAlert('Error','La contraseña no es válida','ok')
      }
      
      console.log('Error onRegister user',error);
    }
  }

  async onRegister(user:User) {
    try{
      return await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
    }catch(error){
      if(error.code === 'auth/email-already-in-use'){
        this.UtilToolService.presentAlert('Error','La dirección de correo electrónico ya está en uso por otra cuenta.','ok')
      } if (error.code === 'auth/wrong-password') {
        this.UtilToolService.presentAlert('Error', 'Contraseña incorrecta', 'ok')
      }
    }

  }

  singOut(){
    this.afAuth.auth.signOut().then(() =>{
      console.log('singOut')
    }).catch(err =>{
      this.UtilToolService.presentAlert('Error','Error al momento de cerrar sesion','ok')
      console.log(err)
    })
  }
}
