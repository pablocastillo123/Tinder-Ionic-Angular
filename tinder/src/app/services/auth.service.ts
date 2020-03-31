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
    afAuth.authState.subscribe(user => (this.isLogged = user));
  }

  async onLogin (user:User) {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (error) {
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
      }
    }

  }
}
