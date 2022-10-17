import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalSocialPageRoutingModule } from './principal-social-routing.module';

import { PrincipalSocialPage } from './principal-social.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalSocialPageRoutingModule
  ],
  declarations: [PrincipalSocialPage]
})
export class PrincipalSocialPageModule {}
