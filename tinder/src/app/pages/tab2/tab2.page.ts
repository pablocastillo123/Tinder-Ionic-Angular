import { UtilToolService } from './../../services/utiltool.service';
import { Component, OnInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{


  constructor(private UtilToolService:UtilToolService, private fcm:FCM ) {
  }
  ngOnInit(){
    this.fcm.getToken().then(token => {
      this.UtilToolService.presentAlert('msg',token,'ok');
    }).catch(err =>{
      this.UtilToolService.presentAlert('msg',err,'ok');
      console.log(err)
    })
  }
  

}
