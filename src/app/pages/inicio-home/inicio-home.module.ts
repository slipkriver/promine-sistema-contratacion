import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioHomePageRoutingModule } from './inicio-home-routing.module';

import { InicioHomePage } from './inicio-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioHomePageRoutingModule
  ],
  declarations: [InicioHomePage]
})
export class InicioHomePageModule {}
