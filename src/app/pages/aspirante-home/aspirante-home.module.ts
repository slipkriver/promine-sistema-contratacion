import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteHomePageRoutingModule } from './aspirante-home-routing.module';

import { AspiranteHomePage } from './aspirante-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteHomePageRoutingModule
  ],
  declarations: [AspiranteHomePage]
})
export class AspiranteHomePageModule {}
