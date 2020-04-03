import { UserfirebseService } from './../../services/userfirebse.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router'
import { AuthService} from '../../services/auth.service'
import { User } from '../../shared/user.class'
import { AlertController, NavController, LoadingController } from '@ionic/angular';

import { UtilToolService  } from '../../services/utiltool.service'

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
    private loadingController: LoadingController,
    private utiltool : UtilToolService) { 
    window.localStorage.clear()

    }

  ngOnInit() {

  }

  async onLogin (event: any) {
    const loading = await this.loadingController.create({
      message: 'Cargando....'
    });
    await loading.present()

      const user = await this.authSvc.onLogin(this.user)

      if(event.target.user.value == "" && event.target.password.value == "") {
        this.utiltool.presentAlert('Error', 'Por favor llene los campos', 'ok')
        loading.dismiss()
      }
      if(event.target.user.value !== "" && event.target.password.value == "") {
        this.utiltool.presentAlert('Error', 'Por favor llene el campo de contraseña', 'ok' )
        loading.dismiss()

      }
      if(event.target.user.value == "" && event.target.password.value !== "") {
        this.utiltool.presentAlert('Error', 'Por favor llene el campo de usuario', 'ok' )
        loading.dismiss()

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
          this.router.navigateByUrl('/tabs/tab2')
          loading.dismiss()

        })
      }  else {
        loading.dismiss()
      }
    }

  

  ionViewDidLeave	 () {
    this.user.email = ""
    this.user.password = ""
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
