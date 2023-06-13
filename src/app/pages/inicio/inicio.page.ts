import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
//import { AuthService } from '../../services/auth.service';
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
  role;

  fecha;
  hora;
  isOpenModal = false;
  version = "";

  constructor(
    public servicioData: DataService,
    //private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.servicioData.getMenu().subscribe((res: any[]) => {
      this.role = this.servicioData.userLogin.role;
      const roles_no = ["medi","psico","segu","legal","segu","guess"]
      this.menu = res
      if( roles_no.includes(this.role) ){
        this.menu.shift()
      }
    })


    this.version = this.servicioData.getAppVersion()

    /*this.servicioData.userLogin$.subscribe(user => {

      console.log(user);
      //this.usuario = user;



    })*/
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

    //console.log("# 1 ",this.fecha, this.hora);
  }

  getFechaFormat(fecha) {
    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechalogin = new Date(fecha);
    // console.log("## 2 ",this.fecha, this.hora);
    return fechalogin.toLocaleString('es-EC', options);
    //this.hora = this.servicioData.userLogin.lastlogin.toString().slice(11, 19);

  }

  getHoraFormat(fecha) {
    return fecha.toString().slice(11, 19);

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
