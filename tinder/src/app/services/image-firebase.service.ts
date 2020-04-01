import { Injectable } from '@angular/core';
import { UtilToolService } from './../services/utiltool.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ImageFirebaseService {

  public url_img:string;

  constructor(private UtilToolService:UtilToolService,private db: AngularFirestore,
    private FireStorage:AngularFireStorage,private loadingController:LoadingController) { }

  ngOnInit() {
    
  }

  public async saveImg(id_user,id_img,base64){
    const loading = await this.loadingController.create({
      message : 'Loading.....'
    })
    await loading.present()

    const id = this.UtilToolService.generateId()
    const ref = this.FireStorage.ref(`base64/${id}`);


    ref.putString(base64, 'base64', {contentType:'image/jpg'}).then(snapshot => {
      snapshot.ref.getDownloadURL().then(downloadURL =>{
        console.log(downloadURL)
        console.log(snapshot)

        this.setImage(id_user,id_img,snapshot.metadata.name,snapshot.metadata.contentType,downloadURL)
      })

    }).catch(err =>{
      this.UtilToolService.presentAlert('error',err,'ok')
      loading.dismiss();

    }).finally(()=>{
      loading.dismiss();

    })

  }

  public setImage(id_user,id_img,name,type,url){

    this.db.collection('image').doc(id_img).set({
      id_img: id_img,
      id_usuario: id_user,
      name: name,
      type: type,
      url: url,

    }).catch(err =>{
      this.UtilToolService.presentAlert('Error',err,'ok');
    })
  }

  public getImage(id_user){
    return this.db.collection('image').doc(id_user).get()
  }

}
