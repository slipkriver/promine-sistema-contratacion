import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteSeguridadPageRoutingModule } from './aspirante-seguridad-routing.module';

import { AspiranteSeguridadPage } from './aspirante-seguridad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteSeguridadPageRoutingModule
  ],
  declarations: [AspiranteSeguridadPage]
})
export class AspiranteSeguridadPageModule {}
