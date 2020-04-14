import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewpicsPage } from './viewpics.page';

const routes: Routes = [
  {
    path: '',
    component: ViewpicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewpicsPageRoutingModule {}
