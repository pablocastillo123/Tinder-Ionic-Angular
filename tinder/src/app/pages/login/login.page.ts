import { LocationService } from './../../services/location.service';
import { UserfirebseService } from './../../services/userfirebse.service';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { AuthService} from '../../services/auth.service'
import { User } from '../../shared/user.class'
import { AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UtilToolService  } from '../../services/utiltool.service'
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
LocationService

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {

  user: User = new User()
  private coord_user

  constructor(private LocationService:LocationService,private androidPermissions:AndroidPermissions,private router: Router, private authSvc: AuthService, private UserfirebseService:UserfirebseService,
    public alertController: AlertController,private loadingController: LoadingController,
    private utiltool : UtilToolService,private geolocation:Geolocation) { 
  }

  ngOnInit() {
    window.localStorage.clear()
  }

  ionViewDidEnter(){
    this.LocationService.checkGPSPermission()
    this.coord_user = this.LocationService.getCoord()
  }

  async onLogin (event: any) {
    const loading = await this.loadingController.create({
      message: 'Cargando....'
    });
    await loading.present()
    window.localStorage.clear()

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

            obj_user.latitud = this.coord_user.latitude
            obj_user.longitud = this.coord_user.longitude

            this.UserfirebseService.updateDataUser(obj_user)
            window.localStorage.setItem('user',JSON.stringify(obj_user))
            console.log(obj_user)
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
  
}
