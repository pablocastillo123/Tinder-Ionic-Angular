import { userInterface } from './../../interface/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../../services/utiltool.service';
import { Observable } from 'rxjs'
import { Camera } from '@ionic-native/camera/ngx';
import { ImageFirebaseService } from './../../services/image-firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  private img_base64: string;
  private image: string;
  private data_image = {
    id_img:'',
    id_usuario:'',
    name:'',
    path:'',
    type:'',
    url:''

  };

  private obj_user: userInterface = {
    name:'',
    last_name:'',
    age: 0,
    sexo: '',
    id:'',
    email:''
  }
  
  private data_sexo = ['Hombre','Mujer'];

  constructor(private afAuth: AngularFireAuth, private db:AngularFirestore,
    private ImageFirebaseService:ImageFirebaseService,private camera:Camera,
    private utilTool:UtilToolService,private loadingController:LoadingController) {
  }

  ngOnInit() {
    this.initPerfil()
  }



  async initPerfil(){
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
            this.data_image = {...image_firebase[i]}
            
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


  async Update_user(){
    let bool:boolean = true

    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

    try {
      if(this.obj_user.age === null || this.obj_user.name === '' || this.obj_user.last_name ===''){
        this.utilTool.presentAlert('Error','Campos vacios','ok');
        bool = false
      }
  
      if(this.obj_user.age > 120 || this.obj_user.age === 0){
        this.utilTool.presentAlert('Error','La edad debe ser menor de 120','ok');
        bool = false;
      }
  
      if(bool){
        if(this.data_image.id_img === ''){
          console.log(this.data_image)
          this.ImageFirebaseService.deleteImage(this.data_image.path)
          this.ImageFirebaseService.deleteImageData(this.data_image.id_img)
        }
        console.log(this.data_image)
        this.db.collection('usuario').doc(this.obj_user.id).update(this.obj_user);

        this.ImageFirebaseService.saveImg(this.obj_user.id,this.img_base64,'perfil')

        this.utilTool.presentAlert('Mensage','Datos Actualizados','ok');
      }
    } catch (error) {
      this.utilTool.presentAlert('Error','Error al hacer esta operacion','ok');
      console.log(error)
      loading.dismiss()

    }finally{
      loading.dismiss()
    }
    
  }

  value_sexo(e){
    this.obj_user.sexo = e.target.value;
  }

  modificarImg(){
    
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
      this.img_base64 = res
      this.image = base64

    }).catch(err =>{
      this.utilTool.presentAlert('error',err,'ok')
    })
  }

}
