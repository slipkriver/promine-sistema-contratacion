import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteNewPageRoutingModule } from './aspirante-new-routing.module';

import { AspiranteNewPage } from './aspirante-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteNewPageRoutingModule
  ],
  declarations: [AspiranteNewPage]
})
export class AspiranteNewPageModule {}
