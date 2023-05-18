import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  menu: any[] = []
  submenu: any[] = [];
  usuario: User;

  fecha;
  hora;
  isOpenModal = false;

  constructor(
    public servicioData: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.servicioData.getMenu().subscribe((res: any[]) => {
      this.menu = res
    })

    this.servicioData.userLogin$.subscribe(user => {

      this.usuario = user;

      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const fechalogin = new Date(this.usuario.lastlogin);
      this.fecha = fechalogin.toLocaleString('es-EC', options);
      this.hora = this.usuario.lastlogin.toString().slice(11, 19);
      //console.log();



    })
  }

  selectItem(item) {
    //console.log(item)
    this.selectSubItem(item.name)

    this.menu.forEach(element => {
      element.activo = false
    });
    item.activo = true


  }

  selectSubItem(item) {
    //this.submenu = this.servicioData.getSubMenu(item)
    //console.log( this.submenu)

    // this.menu.forEach(element => {
    //   element.activo = false
    // });
    // item.activo = true
  }

  ngAfterContentInit() {
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
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  showUserModal(){
    if(this.isOpenModal){
      this.isOpenModal = false;
    }else{
      this.isOpenModal = true;
    }
  }

}
