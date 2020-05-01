import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorieotherusersPageRoutingModule } from './storieotherusers-routing.module';

import { StorieotherusersPage } from './storieotherusers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorieotherusersPageRoutingModule
  ],
  declarations: [StorieotherusersPage]
})
export class StorieotherusersPageModule {}
