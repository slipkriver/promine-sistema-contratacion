import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { DataService } from 'src/app/services/data.service';

// import { DataService } from '../../services/data.service';
//import { AuthService } from '../../services/auth.service';
//import { Router } from '@angular/router';
//import { User } from '../../interfaces/user';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage{

  menu:any = []
  submenu: any[] = [];
  role;

  usuario: User;
  fecha: string = '01-01-2023';
  hora: string = '08:00:00';
  isOpenModal = false;
  version = "";

  constructor(
    private servicioData: DataService
    //private authService: AuthService,
    //private router: Router
  ) { }

  ngOnInit() {

    //this.loadData()
    // console.log("Inicio >>> ngOnInit ",this.usuario);

    this.servicioData.getMenu().subscribe((res) => {
      this.role = this.servicioData.userLogin.role;
      // console.log("usuario >> ",this.servicioData.userLogin);
      const roles_no = ["medi", "psico", "segu", "legal", "segu", "guess"]
      this.menu = res
      if (roles_no.includes(this.role)) {
        this.menu.shift()
      }
      //this.selectItem(this.menu[1])
      this.servicioData.getSubMenu();

    });


    // setTimeout(() => {
    //   this.usuario = this.servicioData.userLogin;
    // }, 2000);



    this.version = this.servicioData.getAppVersion()

    /*this.servicioData.userLogin$.subscribe(user => {

      //this.usuario = user;



    })*/
  }

  async loadData(): Promise<void> {
    await this.servicioData.loadInitData();
    console.log("APP OK!");

    // Aquí puedes llamar a las funciones del servicio que dependen de `storage`
  }

  selectItem(item: any) {
    // console.log(item)
    this.selectSubItem(item.name)

    this.menu.forEach(element => {
      element.activo = false
    });
    item.activo = true


  }

  selectSubItem(item: any) {
    //this.submenu = this.servicioData.getSubMenu(item)
    //console.log( this.submenu)

    // this.menu.forEach(element => {
    //   element.activo = false
    // });
    // item.activo = true
  }

  ngAfterContentInit() {
    this.usuario = this.servicioData.userLogin;
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
    // console.log(fecha);
    return fecha.toString().slice(11, 19);

  }

  cambiarTab(event: any) {
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

  showUserModal() {
    if (this.isOpenModal) {
      this.isOpenModal = false;
    } else {
      this.isOpenModal = true;
    }
  }

}
