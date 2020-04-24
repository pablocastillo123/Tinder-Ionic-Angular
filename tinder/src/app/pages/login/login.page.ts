import { UserfirebseService } from './../../services/userfirebse.service';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { AuthService} from '../../services/auth.service'
import { User } from '../../shared/user.class'
import { AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UtilToolService  } from '../../services/utiltool.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {

  user: User = new User()
  private watch_long ;
  private watch_lat ;

  constructor(private router: Router, private authSvc: AuthService, private UserfirebseService:UserfirebseService,
    public alertController: AlertController,private loadingController: LoadingController,
    private utiltool : UtilToolService,private geolocation:Geolocation) { 
  }

  ngOnInit() {
    window.localStorage.clear()
  }

  async onLogin (event: any) {
    const loading = await this.loadingController.create({
      message: 'Cargando....'
    });
    await loading.present()
    window.localStorage.clear()

    this.geolocation.watchPosition().subscribe((data) => {
      try{
        this.watch_long = data.coords.longitude
        this.watch_lat = data.coords.latitude
        console.log('watch_long:'+this.watch_long+"\nwatch_lat:"+this.watch_lat)
      }catch(error){
        this.utiltool.presentAlert('error',error.message,'ok') 
        console.log('Error watch getting location', error);
      }
    });

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

            obj_user.latitud = this.watch_lat
            obj_user.longitud = this.watch_long

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
