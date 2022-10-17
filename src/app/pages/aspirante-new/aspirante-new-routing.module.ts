import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AspiranteNewPage } from './aspirante-new.page';

const routes: Routes = [
  {
    path: '',
    component: AspiranteNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AspiranteNewPageRoutingModule {}
