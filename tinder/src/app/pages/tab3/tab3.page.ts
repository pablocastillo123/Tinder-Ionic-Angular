import { LikeService } from './../../services/like.service';
import { Component } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private db:AngularFirestore, private LikeService:LikeService) {}

  ngOnInit() {

    this.db.collection('like').doc().set({
      
    })


    this.LikeService.getLikeCollection().subscribe(like_coll =>{
      like_coll.forEach(like => {
        if(like.id_from_user){

        }
      })
    })
  }

}
