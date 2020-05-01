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
    this.id_Match = this.navParams.get('id');
  }

  deleteMatch () {
    this.popoverController.dismiss()
    this.matchService.deleteMatch(this.id_Match)
    this.router.navigate(['/tabs/tab2'])
    this.utilTool.presentAlert('Mensaje','Match Eliminado','ok');

  }

  vaciarChat() {
    this.popoverController.dismiss()
    this.realTime.deleteMessagues(this.id_Match)
    this.utilTool.presentAlert('Mensaje','Chat Vaciado','ok');
    this.navCtrl.navigateRoot('/tabs/tab2');
  }

 

}
