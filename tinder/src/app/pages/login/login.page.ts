import { UserfirebseService } from './../../services/userfirebse.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router'
import { AuthService} from '../../services/auth.service'
import { User } from '../../shared/user.class'
import { AlertController, NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {

  user: User = new User()

  constructor(private router: Router, private authSvc: AuthService, 
    private navCtrl: NavController,private UserfirebseService:UserfirebseService,
    public alertController: AlertController,
    private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async onLogin (event: any) {
    const loading = await this.loadingController.create({
      message: 'Cargando....'
    });
    await loading.present()

    try {
      window.localStorage.clear()

      const user = await this.authSvc.onLogin(this.user)

      if(event.target.user.value == "" && event.target.password.value == "") {
        this.alerta('Por favor llene los campos')
      }
      if(event.target.user.value !== "" && event.target.password.value == "") {
        this.alerta('Por favor llene el campo de contraseña')
      }
      if(event.target.user.value == "" && event.target.password.value !== "") {
        this.alerta('Por favor llene el campo de usuario')

      } if(user) {
        this.UserfirebseService.getUserCollection().subscribe(res => {
          let res_user = res
    
          for(var i=0; i<res_user.length ; i++){
            if(res_user[i].email ===this.user.email ){
            
              let obj_user = {...res_user[i]}
              window.localStorage.setItem('user',JSON.stringify(obj_user))

              break
            }
          }
        })

        console.log(JSON.parse(window.localStorage.getItem('user')))

        loading.dismiss()
        this.router.navigateByUrl('/tabs/tab2')
      }

    } catch (error) {
      loading.dismiss()
      this.alerta(error);

    }finally{
      loading.dismiss();
    }
  }

  async alerta(mensaje) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'problema',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
  
}
