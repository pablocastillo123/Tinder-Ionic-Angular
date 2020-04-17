import { imageInterface } from './../interface/image';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilToolService } from './../services/utiltool.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class ImageFirebaseService {

  private image_collection:AngularFirestoreCollection<imageInterface>
  private image :Observable<imageInterface[]>

  constructor(private UtilToolService:UtilToolService,private db: AngularFirestore,
    private FireStorage:AngularFireStorage) {

      this.image_collection =  this.db.collection<imageInterface>('image')
      
      this.image = this.image_collection.snapshotChanges().pipe(map(
        
      actions =>  {
        return  actions.map(a => {
          const data = a.payload.doc.data()
          return {...data}
        })
      }
    ))

  }

  ngOnInit() {
    
  }

  public async saveImg(id_user,base64,path){

    const id_img_storage = this.UtilToolService.generateId()
    const path_img = `${id_user}/${path}/${id_img_storage}`;
    const ref = this.FireStorage.ref(path_img);

    ref.putString(base64, 'base64', {contentType:'image/jpg'}).then(snapshot => {
      snapshot.ref.getDownloadURL().then(downloadURL =>{
        console.log(downloadURL)
        
        this.setImage(id_user,id_img_storage,path_img,path,snapshot.metadata.name,snapshot.metadata.contentType,downloadURL)
      })

    }).catch(err =>{
      this.UtilToolService.presentAlert('error',err,'ok')
    })

  }

  private setImage(id_user,id_img_storage,path_img,path,name,type,url){

    this.db.collection('image').doc(id_img_storage).set({
      id_img: id_img_storage,
      id_usuario: id_user,
      name: name,
      file_path: path,
      type: type,
      path: path_img,
      url: url,

    }).catch(err =>{
      this.UtilToolService.presentAlert('Error',err,'ok');
    })
  }

  public  getImageCollection(){
    return this.image
  }

  public deleteImage(path_img){
    let delete_img = this.FireStorage.ref(path_img)
    delete_img.delete()
  }

  public deleteImageData(id_img){
    console.log(id_img)
    this.db.collection('image').doc(id_img).delete().catch(err=>{console.log(err)})
  }

  

}
