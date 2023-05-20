import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
//import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { environment } from 'src/environments/environment';


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
  version = environment.version;

  constructor(
    public servicioData: DataService,
    //private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.servicioData.getMenu().subscribe((res: any[]) => {
      this.menu = res
    })

    this.servicioData.userLogin$.subscribe(user => {

      // console.log(user);
      

      this.usuario = user;

      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const fechalogin = new Date(this.servicioData.userLogin.lastlogin);
      this.fecha = fechalogin.toLocaleString('es-EC', options);
      this.hora = fechalogin.toString().slice(11, 19);
      //const x = environment.version;
      //console.log(x);



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
    this.servicioData.logoutUsuario();
    //this.router.navigateByUrl('/', { replaceUrl: true });
    this.servicioData.mostrarLoading("Cerrando sesion de usuario")
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  showUserModal(){
    if(this.isOpenModal){
      this.isOpenModal = false;
    }else{
      this.isOpenModal = true;
    }
  }

}
