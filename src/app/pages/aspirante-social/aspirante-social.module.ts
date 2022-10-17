import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteSocialPageRoutingModule } from './aspirante-social-routing.module';

import { AspiranteSocialPage } from './aspirante-social.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteSocialPageRoutingModule
  ],
  declarations: [AspiranteSocialPage]
})
export class AspiranteSocialPageModule {}
