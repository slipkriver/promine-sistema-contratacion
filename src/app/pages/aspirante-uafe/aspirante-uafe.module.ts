import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AspiranteUafePageRoutingModule } from './aspirante-uafe-routing.module';

import { AspiranteUafePage } from './aspirante-uafe.page';
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
    AspiranteUafePageRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  declarations: [AspiranteUafePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-EC'},
    DatePipe
  ]
})
export class AspiranteUafePageModule {}
