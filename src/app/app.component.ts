import { Component } from '@angular/core';
//import { DataService } from './services/data.service';

// core version + navigation, pagination modules:
//import Swiper from 'swiper';
// import Swiper styles
import { register } from 'swiper/element/bundle';

/*const swiper = new Swiper('.swiper', {
  // configure Swiper to use modules
  modules: [Navigation, Pagination]
});*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    //private dataService:DataService
  ) {
    register()
  }

  // getUsuario() {

  // }

}
