import { LikeService } from './../../services/like.service';
import { Component } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'

import { MatchService } from '../../services/match.service'



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  matches

  constructor(private db: AngularFirestore, private matchService :MatchService ) {}

  ngOnInit() {

    this.matchService.getMatchCollection().subscribe(res => {
      this.matches = res
      this.getData()
    })


  }

  getData () {
    console.log("LOS MATCH ", this.matches)

  }

}
