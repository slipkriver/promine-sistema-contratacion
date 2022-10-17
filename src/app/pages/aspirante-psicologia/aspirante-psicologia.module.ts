import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspirantePsicologiaPageRoutingModule } from './aspirante-psicologia-routing.module';

import { AspirantePsicologiaPage } from './aspirante-psicologia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspirantePsicologiaPageRoutingModule
  ],
  declarations: [AspirantePsicologiaPage]
})
export class AspirantePsicologiaPageModule {}
