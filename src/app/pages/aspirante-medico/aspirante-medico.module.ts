import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteMedicoPageRoutingModule } from './aspirante-medico-routing.module';

import { AspiranteMedicoPage } from './aspirante-medico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteMedicoPageRoutingModule
  ],
  declarations: [AspiranteMedicoPage]
})
export class AspiranteMedicoPageModule {}
