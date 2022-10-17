import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  menu: any[] = []
  submenu: any[] = []

  constructor(
    private servicioData: DataService,
    private authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.servicioData.getMenu().subscribe( (res: any[]) => {
      //console.log(res)
      this.menu = res
    })
  }

  selectItem(item){
    //console.log(item)
    this.selectSubItem(item.name)

    this.menu.forEach(element => {
      element.activo = false
    });
    item.activo = true


  }

  selectSubItem(item){
    this.submenu = this.servicioData.getSubMenu(item)
    //console.log( this.submenu)

    // this.menu.forEach(element => {
    //   element.activo = false
    // });
    // item.activo = true
  }

  ngAfterContentInit(){
    //this.selectSubItem('inicio')

    //this.servicioData.getDatos().subscribe( (res: any[]) => {
      
      //console.log(res['result'])
      
    //})
  }

  cambiarTab(event) {
    //console.log(event)
  }
//   onLogout() {

//  this.authSvc.logout();
//   }

async logout() {
  await this.authService.logout();
  this.router.navigateByUrl('/', { replaceUrl: true });
}

}
