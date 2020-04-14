import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewpicsPageRoutingModule } from './viewpics-routing.module';

import { ViewpicsPage } from './viewpics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewpicsPageRoutingModule
  ],
  declarations: [ViewpicsPage]
})
export class ViewpicsPageModule {}
