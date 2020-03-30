import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router'
import { AuthService} from '../../services/auth.service'
import { User } from '../../shared/user.class'
import { AlertController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {

  user: User = new User()

  constructor(private router: Router, private authSvc: AuthService, 
    private navCtrl: NavController,
    public alertController: AlertController) { }

  ngOnInit() {
  }

  async onLogin (event: any) {

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
      
      this.router.navigateByUrl('/tabs/tab2')
       
  } else {
    this.alerta('Usuario no econtrado o contraseña incorrecta')
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
