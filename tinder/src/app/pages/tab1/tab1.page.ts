import { AuthService } from './../../services/auth.service';
import { userInterface } from './../../interface/user';
import { Component } from '@angular/core';
import { ImageFirebaseService } from './../../services/image-firebase.service';
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../../services/utiltool.service';
import { Router } from '@angular/router';
import { UserfirebseService } from '../../services/userfirebse.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private image:string;
  private obj_user: userInterface;

  constructor(private loadingController:LoadingController,
    private router: Router,private UserfirebseService:UserfirebseService,
    private ImageFirebaseService:ImageFirebaseService,private AuthService:AuthService) {}

  ngOnInit() {
    this.initDataUser()
  }

  async initDataUser(){
    const loading = await this.loadingController.create({
      message : 'Loading.....',
    })
    await loading.present()

      this.obj_user = JSON.parse(window.localStorage.getItem('user'))
      console.log(this.obj_user)

      this.UserfirebseService.getUserCollection().subscribe(user_firebase =>{
        user_firebase.forEach(element => {
          if(element.id === this.obj_user.id){
            this.obj_user = element
            window.localStorage.setItem('user',JSON.stringify(element))
          }
        })
      })

      this.ImageFirebaseService.getImageCollection().subscribe(image_firebase =>{
        for(var i=0; i<image_firebase.length; i++){
          if(image_firebase[i].id_usuario === this.obj_user.email && image_firebase[i].file_path === 'perfil'){
            this.image = image_firebase[i].url;
            
            break;
          }
        }
      })

      loading.dismiss()

  }

  async signOut(){
    const loading = await this.loadingController.create({
      message : 'Loading.....',
      duration: 5000
    })
    await loading.present()

    window.localStorage.clear();
    this.AuthService.singOut();

    loading.dismiss()
    this.router.navigateByUrl('/login');

  }
  
}
