import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorieviewPage } from './storieview.page';

const routes: Routes = [
  {
    path: '',
    component: StorieviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorieviewPageRoutingModule {}
