import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { User } from './../../shared/user.class';
import { UtilToolService } from '../../services/utiltool.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

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

  constructor(
    private authSvc: AuthService,private router: Router,private utilTool:UtilToolService,
    private formBuilder: FormBuilder,private db: AngularFirestore,private loadingController:LoadingController
    ){}

  registerForm = this.formBuilder.group({
    name:['',Validators.required], 
    last_name:['',Validators.required],
    password:['',[Validators.required,Validators.minLength(6)]],
    email:['',[Validators.required,Validators.pattern(this.exp)]],
    age:[0,Validators.required],
  });

  onRegister(){
    const reg = this.registerForm;

   if(Validators.required(reg.get('name')) || Validators.required(reg.get('last_name'))
      ||Validators.required(reg.get('age')) || Validators.required(reg.get('email'))
      || Validators.required(reg.get('password'))){

      this.utilTool.presentAlert('error','Campos vacios','ok');
    
      }else{
        if(Validators.email(reg.get('email'))){
        this.utilTool.presentAlert('error','Direccion de email invalida','ok');
        }

        if(reg.get('age').value > 120 || reg.get('age').value === 0){
          this.utilTool.presentAlert('error','La edad debe ser menor de 120','ok');
        }
        
        if(reg.get('password').value.length < 6){
          console.log(reg.get('password').value.length)
          this.utilTool.presentAlert('error','El password debe tener al menos 6 caracteres','ok');
        }else{
          this.register();
        }
      }
  }


  async register(){

    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

      try{
        const id_user = this.utilTool.generateId();
        const user = await this.authSvc.onRegister(this.user);

        this.db.collection("usuario").doc(id_user).set({
          id:id_user,
          name:this.user.name,
          last_name:this.user.last_name,
          email:this.user.email,
          age:this.user.age,
          sexo:this.user_sexo
        }).then(res => console.log(res)).catch(err => console.log(err));

        if(user){
        this.router.navigateByUrl('/');
        }
      }catch(error){
        this.utilTool.presentAlert('Error',error,'ok');

      }finally{
      loading.dismiss();
    }
  }

  value_sexo(e){
    this.user_sexo = e.target.value;
  }

   verifiEmail(){
    var coll_fb  = this.db.collection('usuario',ref => 
    ref.where('email','==',this.registerForm.get('email').value)).snapshotChanges().pipe(
      map(actions =>{
        return actions.map(a =>{
          const data = a.payload.doc.data()
          return data;
        })
      })
    ).subscribe(data => console.log(data[0]['email']));
  }
}