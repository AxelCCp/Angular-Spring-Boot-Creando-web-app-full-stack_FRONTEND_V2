import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';         //PARA ACTIVAR EL PATH VARIABLE DE LA PAGINACIÓN

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  constructor(clienteService:ClienteService, activatedRoute : ActivatedRoute) {
    this.clienteService = clienteService;
    this.activatedRoute = activatedRoute;
  }

//CON LIST
/*
  ngOnInit(): void {
      //this.clientes = this.clienteService.getClientes();
      this.clienteService.getClientes()

      .pipe(tap(clientes => {
        console.log('ClientesComponent : tap 3');
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
      });
    })
    )

    .subscribe((clientes) => {
          this.clientes = clientes;     //ESTA LÍNEA DE CÓDIGO TAMBN SE PUEDE AGREGAR AL TAP().
        }
      );
  }*/

  //CON PAGE
  //activatedRoute.paramMap : SE ENCARGA DE SUSCRIBIR UN OBSERVADOR CADA VEZ QUE CAMBIA EL PARÁMETRO PAGE EN LA RUTA. RECARGANDO EL LISTADO DE CLIENTES SEGUN EL n° PAGINA
  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        //EL + COMBIERTE ESTE STRING "params.get('page')" EN UN ENTERO.
        let page : number = +params.get('page');
        //SI PAGE NO ESTÁ DEFINIDO
        if(!page){
          page = 0;
        }
        this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent : tap 3');
            (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
          })
        ).subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });
  }

  public delete(cliente : Cliente) : void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          //PARA ACTUALIZAR AUTOMÁTICAMENTE LA LISTA CON EL CLIENTE Q SE ELIMINÓ. SE USA FILTRO.
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          swalWithBootstrapButtons.fire(
            'Cliente eliminado!',
            `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con éxito!`,
            'success'
          )
        })
      }
    })
  }

  clientes : Cliente[];
  private clienteService : ClienteService;
  private activatedRoute : ActivatedRoute;
  paginador : any;
  clienteSeleccionado : Cliente;

}
