import { Component, OnInit } from '@angular/core';
import { UserfirebseService } from './../../services/userfirebse.service';
import { userInterface } from './../../interface/user';
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../../services/utiltool.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  private obj_user: userInterface
  private user_config_sexo 
  private user_config_rango: number
  private user_config_age: any = {
    upper:0,
    lower:0
  }

  private checkbox = {

  }

  constructor(private UserfirebseService:UserfirebseService,private router : Router,
    private utilTool:UtilToolService,private loadingController:LoadingController) { }

  ngOnInit() {
    this.obj_user = JSON.parse(window.localStorage.getItem('user'))
    console.log(this.obj_user)

    this.user_config_sexo = this.obj_user.config_sexo
    this.user_config_rango = this.obj_user.config_rango
    this.user_config_age = this.obj_user.config_age
  }

  getCheck(checkbox){
    this.user_config_sexo = checkbox
  }

  async updateAjustes(){
    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

    try {
      if(this.user_config_rango != this.obj_user.config_rango){

        this.obj_user.config_rango = this.user_config_rango
      }

      if(this.user_config_age.lower !== this.obj_user.config_age.lower || 
        this.user_config_age.upper !== this.obj_user.config_age.upper){
        
        this.obj_user.config_age = this.user_config_age
      }

      if(this.user_config_sexo.hombre !== this.obj_user.config_sexo.hombre ||
        this.user_config_sexo.mujer !== this.obj_user.config_sexo.mujer){

        this.obj_user.config_sexo = this.user_config_sexo
      }

      this.UserfirebseService.updateDataUser(this.obj_user)

      loading.dismiss()
      window.localStorage.setItem('user',JSON.stringify(this.obj_user))
      this.utilTool.presentAlert('Mensage','Datos Actualizados','ok');
      this.router.navigateByUrl('/tabs/tab1')
        
      
      
    } catch (error) {
      this.utilTool.presentAlert('Error','Error al hacer esta operacion','ok');
      console.log(error)
      loading.dismiss()

    }finally{
      loading.dismiss()
    }
  }
}
