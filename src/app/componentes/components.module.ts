import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormValidarMediComponent } from './form-validar-medi/form-validar-medi.component';
import { FormValidarPsicoComponent } from './form-validar-psico/form-validar-psico.component';
import { FormValidarLegalComponent } from './form-validar-legal/form-validar-legal.component';
import { FormValidarSeguComponent } from './form-validar-segu/form-validar-segu.component';
import { HeaderSubmenuComponent } from './header-submenu/header-submenu.component';
import { BuscarAspiranteComponent } from './buscar-aspirante/buscar-aspirante.component';
import { ItemAspiranteComponent } from './item-aspirante/item-aspirante.component';
import { LoadingAspiranteComponent } from './loading-aspirante/loading-aspirante.component';
import { FormValidarTthhComponent } from './form-validar-tthh/form-validar-tthh.component';
import { PopoverInfoComponent } from './popover-info/popover-info.component';
import { ListObservacionComponent } from './list-observacion/list-observacion.component';
import { ListCargosComponent } from './list-cargos/list-cargos.component';
import { SwiperModule } from 'swiper/angular';
import { FileFormdataComponent } from './file-formdata/file-formdata.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    FormValidarLegalComponent,
    FormValidarSeguComponent,
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent,
    PopoverInfoComponent,
    ListObservacionComponent,
    ListCargosComponent,
    FileFormdataComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    SwiperModule,
    MatTooltipModule
  ],
  entryComponents: [
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    FormValidarLegalComponent,
    FormValidarSeguComponent,
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent,
    PopoverInfoComponent,
    ListObservacionComponent,
    ListCargosComponent,
    FileFormdataComponent
  ],

  exports: [
    FormValidarTthhComponent,
    FormValidarMediComponent,
    FormValidarPsicoComponent,
    FormValidarLegalComponent,
    FormValidarSeguComponent,
    HeaderSubmenuComponent,
    BuscarAspiranteComponent,
    ItemAspiranteComponent,
    LoadingAspiranteComponent,
    PopoverInfoComponent,
    ListObservacionComponent,
    ListCargosComponent,
    FileFormdataComponent
  ]
})
export class ComponentsModule { }
