import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImgFirebasePageRoutingModule } from './img-firebase-routing.module';

import { ImgFirebasePage } from './img-firebase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImgFirebasePageRoutingModule
  ],
  declarations: [ImgFirebasePage]
})
export class ImgFirebasePageModule {}
