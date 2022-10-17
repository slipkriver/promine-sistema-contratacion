import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspiranteMedicoPage } from './aspirante-medico.page';

const routes: Routes = [
  {
    path: '',
    component: AspiranteMedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspiranteMedicoPageRoutingModule {}
