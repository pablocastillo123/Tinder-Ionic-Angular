import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx'
import { Platform } from '@ionic/angular';

const STORAGE_KEY = 'my_images'

@Component({
  selector: 'app-pic',
  templateUrl: './pic.page.html',
  styleUrls: ['./pic.page.scss'],
})

export class PicPage implements OnInit {

  image = []

  nombre = [0,1,2,3,4,5,6,7,8]

  constructor(private camera : Camera) { }

  ngOnInit() {
    
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
    })
  }

}
