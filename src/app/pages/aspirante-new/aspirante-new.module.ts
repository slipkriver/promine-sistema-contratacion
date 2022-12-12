import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteNewPageRoutingModule } from './aspirante-new-routing.module';

import { AspiranteNewPage } from './aspirante-new.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import {MatInputModule} from '@angular/material/input';
import {MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AspiranteNewPageRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  declarations: [AspiranteNewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-EC'},
  ]
})

export class AspiranteNewPageModule {}