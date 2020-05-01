import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorieotherusersPage } from './storieotherusers.page';

const routes: Routes = [
  {
    path: '',
    component: StorieotherusersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorieotherusersPageRoutingModule {}
