import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspiranteSocialPage } from './aspirante-social.page';

const routes: Routes = [
  {
    path: '',
    component: AspiranteSocialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspiranteSocialPageRoutingModule {}
