import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormValidarMediComponent } from './form-validar-medi/form-validar-medi.component';
import { FormValidarPsicoComponent } from './form-validar-psico/form-validar-psico.component';
import { HeaderSubmenuComponent } from './header-submenu/header-submenu.component';
import { BuscarAspiranteComponent } from './buscar-aspirante/buscar-aspirante.component';
import { ItemAspiranteComponent } from './item-aspirante/item-aspirante.component';
import { LoadingAspiranteComponent } from './loading-aspirante/loading-aspirante.component';
import { FormValidarTthhComponent } from './form-validar-tthh/form-validar-tthh.component';




@NgModule({
  declarations: [
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,

  ],
  entryComponents: [
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent
  ],

  exports: [
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent
  ]
})
export class ComponentsModule { }
