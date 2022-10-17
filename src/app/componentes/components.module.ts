import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormValidarMediComponent } from './form-validar-medi/form-validar-medi.component';
import { FormValidarPsicoComponent } from './form-validar-psico/form-validar-psico.component';
import { HeaderSubmenuComponent } from './header-submenu/header-submenu.component';




@NgModule({
  declarations: [
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    HeaderSubmenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,

  ],
  entryComponents: [
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    HeaderSubmenuComponent
  ],

  exports: [
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    HeaderSubmenuComponent
  ]
})
export class ComponentsModule { }
