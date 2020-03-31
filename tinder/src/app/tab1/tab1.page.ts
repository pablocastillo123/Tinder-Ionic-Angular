import { userInterface } from './../interface/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import { LoadingController } from '@ionic/angular';
import { UtilToolService } from './../services/utiltool.service';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private user_collection: AngularFirestoreCollection<userInterface>
  private user: Observable<userInterface[]>
  private user_sexo:string;
  private user_email:string;

  private obj_user = {
    name:'',
    last_name:'',
    age: 0,
    sexo: '',
    id:'',
    email:''
  }
  
  private data_sexo = ['Hombre','Mujer'];

  constructor(private afAuth: AngularFireAuth, private db:AngularFirestore,
    private utilTool:UtilToolService,private loadingController:LoadingController) {
  }

  ngOnInit() {
    this.initPerfil()
  }

  async initPerfil(){
    const loading = await this.loadingController.create({
      message : 'Loading.....',
      duration: 10000
    })
    await loading.present()

    this.user_collection = this.db.collection<userInterface>('usuario')

    this.user = this.user_collection.snapshotChanges().pipe(map(act =>{
      return act.map(a =>{
        const data = a.payload.doc.data()
        return {...data};
      })
    }))

    this.user.subscribe(res => {
      let res_user = res

      //variable del localstorage
      for(var i=0; i<res_user.length ; i++){
        if(res_user[i].email === 'ana-cas@gmail.com' ){
        
          this.obj_user = {
            name: res_user[i].name,
            last_name: res_user[i].last_name,
            age: res_user[i].age,
            sexo: res_user[i].sexo,
            id: res_user[i].id,
            email: res_user[i].email
          }

          console.log(this.obj_user)
          break
        }
      }
    })

    loading.dismiss()
  }


  async Update_user(){
    let bool:boolean = true

    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

    try {
      if(this.obj_user.age === null || this.obj_user.name === '' || this.obj_user.last_name ===''){
        this.utilTool.presentAlert('error','Campos vacios','ok');
        bool = false
      }
  
      if(this.obj_user.age > 120 || this.obj_user.age === 0){
        this.utilTool.presentAlert('error','La edad debe ser menor de 120','ok');
        bool = false;
      }
  
      if(bool){
        // console.log('modificar',this.obj_user)
        this.db.collection('usuario').doc(this.obj_user.id).update(this.obj_user);
        this.utilTool.presentAlert('Mensage','Datos Actualizados','ok');
  
      }
    } catch (error) {
      this.utilTool.presentAlert('error','Debe ingresar los datos de manera correcta','ok');
      console.log(error)

    }finally{
      loading.dismiss()
    }
    
  }

  value_sexo(e){
    this.obj_user.sexo = e.target.value;
  }
  
}
