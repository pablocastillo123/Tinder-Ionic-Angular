import { Component, OnInit } from '@angular/core';

import { MatchService } from '../../services/match.service'
import { NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

import { PopoverController, IonContent } from '@ionic/angular';

import { NavController } from '@ionic/angular';

import { RealtimeService } from '../../services/realtime.service'

import { UtilToolService } from '../../services/utiltool.service'


@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  id_Match;

  constructor(private matchService : MatchService, public navParams:NavParams, private router : Router, 
    public popoverController: PopoverController, public navCtrl: NavController,
    private realTime : RealtimeService, private utilTool:UtilToolService ) { }

  ngOnInit() {
    console.log(this.navParams.data, "La dataa");
    this.id_Match = this.navParams.get('id');
    console.log("Variable del id", this.id_Match)
  }

  deleteMatch () {
    this.popoverController.dismiss()
    this.matchService.deleteMatch(this.id_Match)
    this.router.navigate(['/tabs/tab2'])
    this.utilTool.presentAlert('Mensage','Match Eliminado','ok');

    console.log("Eliminado")
  }

  vaciarChat() {
    this.popoverController.dismiss()
    this.realTime.deleteMessagues(this.id_Match)
    this.utilTool.presentAlert('Mensage','Chat Vaciado','ok');
    this.navCtrl.navigateRoot('/tabs/tab2');
  }

 

}
