import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { register } from 'swiper/element/bundle';
register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private dataService:DataService
  ) {

    this.loadData();

  }

  private async loadData(): Promise<void> {
    await this.dataService.loadInitData()
    console.log("APP OK!")

    // Aquí puedes llamar a las funciones del servicio que dependen de `storage`
  }

}
