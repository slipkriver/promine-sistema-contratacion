import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalLegalPageRoutingModule } from './principal-legal-routing.module';

import { PrincipalLegalPage } from './principal-legal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalLegalPageRoutingModule
  ],
  declarations: [PrincipalLegalPage]
})
export class PrincipalLegalPageModule {}
