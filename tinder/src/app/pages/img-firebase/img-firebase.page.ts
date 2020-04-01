import { ImageFirebaseService } from './../../services/image-firebase.service';
import { UtilToolService } from './../../services/utiltool.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-img-firebase',
  templateUrl: './img-firebase.page.html',
  styleUrls: ['./img-firebase.page.scss'],
})
export class ImgFirebasePage implements OnInit {

  private image:any;
  id_pablo = '5q0mhdlyk7q2wg9cr7b2z2'
  id_img

  constructor(private ImageFirebaseService:ImageFirebaseService,private camera: Camera,private UtilToolService:UtilToolService,
    private FireStorage:AngularFireStorage,private loadingController:LoadingController) { }

  ngOnInit() {
    
  }

  async saveImg(e){
  
    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

    this.id_img = this.UtilToolService.generateId()
    const file = e.target.files[0]
    const file_path = `${this.id_pablo}/${this.id_img}`;
    const task = this.FireStorage.upload(file_path,file)

    task.then(snapshot => {
      snapshot.ref.getDownloadURL().then(downloadURL =>{
        console.log(downloadURL)
        console.log(snapshot.ref)
        this.image = downloadURL
        this.ImageFirebaseService.setImage(this.id_pablo,this.id_img,snapshot.metadata.name,snapshot.metadata.contentType,downloadURL)

      })
    })

    loading.dismiss();


  }

  
  tomarFoto(){
    this.camera.getPicture({

    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType:this.camera.PictureSourceType.CAMERA,
    mediaType:this.camera.MediaType.PICTURE,
    allowEdit:false,
    encodingType:this.camera.EncodingType.JPEG,
    targetHeight: 1024,
    targetWidth: 1024,
    saveToPhotoAlbum:true
      
    }).then(res =>{
      let base64 = 'data:image/jpeg;base64,' + res
      this.image = base64
      this.ImageFirebaseService.saveImg(this.id_pablo,this.id_img,res)
      console.log(this.ImageFirebaseService.url_img)

    }).catch(err =>{
      this.UtilToolService.presentAlert('error',err,'ok')
    })
  }
  
  galeria(){
    this.camera.getPicture({

      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType:this.camera.MediaType.PICTURE,
      allowEdit:false,
      encodingType:this.camera.EncodingType.JPEG,
      targetHeight: 300,
      targetWidth: 300,
      saveToPhotoAlbum:true
        
      }).then(res =>{
        let base64 = 'data:image/jpeg;base64,' + res
        this.image = base64
        this.ImageFirebaseService.saveImg(this.id_pablo,this.id_img,res)
        console.log(this.ImageFirebaseService.url_img)

      }).catch(err =>{
        this.UtilToolService.presentAlert('error',err,'ok')
      })
    }


}


 