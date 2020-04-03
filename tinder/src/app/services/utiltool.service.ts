import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular' 
@Injectable({
  providedIn: 'root'
})
export class UtilToolService {

  constructor(private loadingController:LoadingController, private alert:AlertController) { }


  async presentAlert(header_text:string, msg_text:string, btn_text:string) {
    const alert = await this.alert.create({
      header: header_text,
      message: msg_text,
      buttons: [btn_text]
    });
    await alert.present();
  }

  generateId():string{
    return Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
  }

}
