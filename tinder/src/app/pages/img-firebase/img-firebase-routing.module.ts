import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImgFirebasePage } from './img-firebase.page';

const routes: Routes = [
  {
    path: '',
    component: ImgFirebasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImgFirebasePageRoutingModule {}
