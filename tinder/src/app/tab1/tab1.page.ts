import { AuthService } from './../services/auth.service';
import { userInterface } from './../interface/user';
import { Component } from '@angular/core';
import { ImageFirebaseService } from './../services/image-firebase.service';
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../services/utiltool.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private image:string;
  private obj_user: userInterface 

  constructor(private utilTool:UtilToolService,private loadingController:LoadingController,
    private router: Router,
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

      this.ImageFirebaseService.getImageCollection().subscribe(image_firebase =>{
        for(var i=0; i<image_firebase.length; i++){
          if(image_firebase[i].id_usuario === this.obj_user.id){
            this.image = image_firebase[i].url;
            
            break;
          }
        }
      })

      loading.dismiss()

  }

  signOut(){
    window.localStorage.clear();
    this.AuthService.singOut();
    this.router.navigateByUrl('/login');
  }
  
}
