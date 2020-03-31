import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PicPageRoutingModule } from './pic-routing.module';

import { PicPage } from './pic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PicPageRoutingModule
  ],
  declarations: [PicPage]
})
export class PicPageModule {}
