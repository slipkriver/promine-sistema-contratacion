import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalSocialPageRoutingModule } from './principal-social-routing.module';

import { PrincipalSocialPage } from './principal-social.page';
import { ComponentsModule } from '../../componentes/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalSocialPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrincipalSocialPage]
})
export class PrincipalSocialPageModule {}
