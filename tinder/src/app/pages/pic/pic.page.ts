import { imageInterface } from './../../interface/image';
import { userInterface } from './../../interface/user';
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../../services/utiltool.service';
import { ImageFirebaseService } from './../../services/image-firebase.service';
import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx'

import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

const STORAGE_KEY = 'my_images'

@Component({
  selector: 'app-pic',
  templateUrl: './pic.page.html',
  styleUrls: ['./pic.page.scss'],
})

export class PicPage implements OnInit {

  private image = []
  private data_img = []
  private nombre = [0,1,2,3,4,5,6,7,8]

  private obj_user: userInterface = {
    name:'',
    last_name:'',
    age: 0,
    sexo: '',
    id:'',
    email:''
  }

  constructor(private camera : Camera,private ImageFirebaseService:ImageFirebaseService,
    private utilTool:UtilToolService,private loadingController:LoadingController,
    private router : Router
  ) { }

  ngOnInit() {
    this.initImage()
  }

  // presionar(index){
  //   console.log( "Este es el index: ", index)
  //   this.nombre[index] = 'holaa'
  // }

  // sacarCamara () {
  //   this.camera.getPicture({
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     allowEdit: false,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     targetHeight: 1024,
  //     targetWidth: 1024,
  //     correctOrientation: true,
  //     saveToPhotoAlbum: true
  //   }).then(resultado => {
  //     this.image = "data:image/jpeg;base64," + resultado
  //   })
  // }

  tomarGaleria (index) {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 1024,
      targetWidth: 1024,
      correctOrientation: true,
      saveToPhotoAlbum: true

    }).then(resultado => {
      this.image[index] = "data:image/jpeg;base64," + resultado

    }).catch(err =>{
      console.log(err)
      this.utilTool.presentAlert('error',err,'ok')
    })
  }

  async initImage(){

    const loading = await this.loadingController.create({
      message : 'Loading.....',
    })
    await loading.present()

      this.obj_user = JSON.parse(window.localStorage.getItem('user'))
      console.log(this.obj_user)

      this.ImageFirebaseService.getImageCollection().subscribe(res =>{
        this.image.length = this.image.length = 0
        this.data_img.length = this.data_img.length = 0

        console.log('arreglo image clear',this.image)
        console.log('arreglo data_img clear',this.data_img)
        

        for(var i=0; i<res.length; i++){

          if(res[i].id_usuario === this.obj_user.email && res[i].file_path === 'historia'){
            this.image.push(res[i].url);
            this.data_img.push(res[i])
          }
        }

        
      })

      loading.dismiss()

   
  }

  async imgSaveFirebase(){
    
    const str_base64 = "data:image/jpeg;base64,"
    let img = this.image;

    console.log('arreglo image',this.image)
    console.log('arreglo data_img ',this.data_img)

    for(var i=0; i<img.length; i++){
      if(img[i]){

        let str_img_base64 = img[i].substring(0,str_base64.length)
        let img_sin_str_base64 = img[i].substring(str_base64.length)

        if(str_base64 === str_img_base64){
          await this.ImageFirebaseService.saveImg(this.obj_user.email,img_sin_str_base64,'historia')

          // this.utilTool.presentAlert('Exito', 'Archivo subido exitosamente', 'ok')

          // this.router.navigateByUrl('/tabs/tab1')

          if(this.data_img[i].id_img){
            this.ImageFirebaseService.deleteImage(this.data_img[i].path)
            this.ImageFirebaseService.deleteImageData(this.data_img[i].id_img)
          }
        }
      }
    }



  }

  

}
