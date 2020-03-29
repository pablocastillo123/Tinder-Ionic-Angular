import { UtilToolService } from './../../services/utiltool.service';
import { User } from './../../shared/user.class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore'
import { map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  private user_email;
  public data_user;
  private data_sexo = ['Hombre','Mujer'];

  constructor(private afAuth: AngularFireAuth, private db:AngularFirestore,
    private utilTool:UtilToolService,private loadingController:LoadingController) {
  }

  ngOnInit() {
    this.initPerfil()
  }

  async initPerfil(){
    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

    this.user_email = window.localStorage.getItem('email');

    var db_user = this.db.collection('usuario',ref => 
    ref.where('email','==',this.user_email)).snapshotChanges().pipe(map(act =>{
      return act.map(a =>{
        const data = a.payload.doc.data()
        return data;
      })
    })).subscribe(data => {
      loading.dismiss();

      this.data_user = {
        age: data[0]['age'],
        email: data[0]['email'],
        id: data[0]['id'],
        last_name: data[0]['last_name'],
        name: data[0]['name'],
        sexo: data[0]['sexo'],
      }
    })
  }

  Update_user(){
    let bool:boolean = true

    if(this.data_user.age === null || this.data_user.name === '' || this.data_user.last_name ===''){
      this.utilTool.presentAlert('error','Campos vacios','ok');
      bool = false
    }

    if(this.data_user.age > 120 || this.data_user.age === 0){
      this.utilTool.presentAlert('error','La edad debe ser menor de 120','ok');
      bool = false;
    }

    if(bool){
      console.log('modificar',this.data_user)
      this.db.collection('usuario').doc(this.data_user.id).update(this.data_user);
      this.utilTool.presentAlert('Mensage','Datos Actualizados','ok');

    }
  }

  value_sexo(e){
    this.data_user.sexo = e.target.value;
  }

}
