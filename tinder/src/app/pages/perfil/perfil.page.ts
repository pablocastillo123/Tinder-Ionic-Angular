import { UserfirebseService } from './../../services/userfirebse.service';
import { userInterface } from './../../interface/user';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../../services/utiltool.service';
import { Camera } from '@ionic-native/camera/ngx';
import { ImageFirebaseService } from './../../services/image-firebase.service';
import { Router } from '@angular/router';

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
    email:'',
    latitud: 0,
    longitud: 0,
    config_sexo: null,
    config_age: null,
    config_rango: 0,
    km : 0,
    token_notification:''
  }
  
  private data_sexo = ['Hombre','Mujer'];

  constructor(private router : Router,
    private ImageFirebaseService:ImageFirebaseService,private camera:Camera,
    private UserfirebseService:UserfirebseService,
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
          if(image_firebase[i].id_usuario === this.obj_user.email && image_firebase[i].file_path === 'perfil'){
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


  async update_user(){
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
        if(this.img_base64){
          this.ImageFirebaseService.deleteImage(this.data_image.path)
          this.ImageFirebaseService.deleteImageData(this.data_image.id_img)
        }

        this.UserfirebseService.updateDataUser(this.obj_user)

        if(this.img_base64){
          this.ImageFirebaseService.saveImg(this.obj_user.email,this.img_base64,'perfil')
        }

        loading.dismiss()
        window.localStorage.setItem('user',JSON.stringify(this.obj_user))
        this.utilTool.presentAlert('Mensaje','Datos Actualizados','ok');
        this.router.navigateByUrl('/tabs/tab1')
        
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
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 1024,
      targetWidth: 1024,
      correctOrientation: true,
      saveToPhotoAlbum: true
        
    }).then(res =>{
      let base64 = 'data:image/jpeg;base64,' + res
      this.img_base64 = res
      this.image = base64

    }).catch(err =>{
      this.utilTool.presentAlert('error',err,'ok')
    })
  }

}
