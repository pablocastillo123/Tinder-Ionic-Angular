import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { User } from './../../shared/user.class';
import { UtilToolService } from '../../services/utiltool.service'
import { FormBuilder, Validators } from '@angular/forms'
import { AngularFirestore} from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { ImageFirebaseService } from './../../services/image-firebase.service';
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  private user: User = new User();
  private exp: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  private data_sexo = ['Hombre','Mujer'];
  private user_sexo:string;
  private email_user:string;
  private image:string;
  private id_user = this.utilTool.generateId();
  private img_base64:string
  

  constructor(
    private authSvc: AuthService,private router: Router,private utilTool:UtilToolService,
    private ImageFirebaseService:ImageFirebaseService,private camera:Camera, private fcm:FCM,
    private formBuilder: FormBuilder,private db: AngularFirestore,private loadingController:LoadingController
    ){}

  registerForm = this.formBuilder.group({
    name:['',Validators.required], 
    last_name:['',Validators.required],
    password:['',[Validators.required,Validators.minLength(6)]],
    email:['',[Validators.required,Validators.pattern(this.exp)]],
    age:[0,Validators.required],
  });

  value_sexo(e){
    this.user_sexo = e.target.value;
  }

  onRegister(){
    const reg = this.registerForm;

   if(Validators.required(reg.get('name')) || Validators.required(reg.get('last_name'))
      ||Validators.required(reg.get('age')) || Validators.required(reg.get('email'))
      || Validators.required(reg.get('password'))){

      this.utilTool.presentAlert('Error','Campos vacios','ok');
    
      }else{
        if(Validators.email(reg.get('email'))){
        this.utilTool.presentAlert('Error','Direccion de email invalida','ok');
        }

        if(reg.get('age').value > 120 || reg.get('age').value === 0){
          this.utilTool.presentAlert('Error','La edad debe ser menor de 120','ok');
        }
        
        if(reg.get('password').value.length < 6){
          console.log(reg.get('password').value.length)
          this.utilTool.presentAlert('Error','El password debe tener al menos 6 caracteres','ok');
        
        }if(this.email_user == reg.get('email').value){
          this.utilTool.presentAlert('Error','El email esta en uso','ok');
        }

        else{
          this.register();
        }
      }
  }

  ionViewDidLeave	 () {
    this.user.name = ""
    this.user.last_name = ""
    this.user_sexo = ""
    this.user.age = 0
    this.user.email = ""
    this.user.password = ""
  }


  async register(){

    let token_fcm: string;

    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

      try{
        this.fcm.getToken().then(token => {
          console.log(token)
          token_fcm = token
        }).catch(err =>{
          console.log(err)
        })

        const user = await this.authSvc.onRegister(this.user)

        if(user){
          this.db.collection("usuario").doc(this.id_user).set({
            id: this.id_user,
            name: this.user.name,
            last_name: this.user.last_name,
            email: this.user.email,
            age: this.user.age,
            sexo: this.user_sexo,
            notification_token: token_fcm,
            visible: true
          })

          if(this.img_base64){
            this.ImageFirebaseService.saveImg(this.user.email,this.img_base64,'perfil')
          }

          this.utilTool.presentAlert('Exitoso', 'Registro Exitoso', 'ok')
          
          this.router.navigateByUrl('/login');

        }
        
      }catch(error){
        if(error.code === 'invalid-argument'){
          this.utilTool.presentAlert('Error','Campos vacios','ok');
        }
        loading.dismiss();

      }finally{
      loading.dismiss();
    }
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