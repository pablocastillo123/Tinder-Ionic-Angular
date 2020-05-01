import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorieviewPageRoutingModule } from './storieview-routing.module';

import { StorieviewPage } from './storieview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorieviewPageRoutingModule
  ],
  declarations: [StorieviewPage]
})
export class StorieviewPageModule {}
