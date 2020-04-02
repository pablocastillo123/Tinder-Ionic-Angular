import { userInterface } from './../interface/user';
import { Component } from '@angular/core';
import { ImageFirebaseService } from './../services/image-firebase.service';
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../services/utiltool.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private image:string;
  private obj_user: userInterface 

  constructor(private utilTool:UtilToolService,private loadingController:LoadingController,
    private ImageFirebaseService:ImageFirebaseService) {}

  ngOnInit() {
    this.initDataUser()
  }

  async initDataUser(){
    const loading = await this.loadingController.create({
      message : 'Loading.....',
    })
    await loading.present()

    try {
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

    }catch(error){
      console.log(error)
      loading.dismiss()

    }finally{
      loading.dismiss()
    }
    

  }

  
}
