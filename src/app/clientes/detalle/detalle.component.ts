import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';       //SE PONE .. PARA RETROCEDER EN UNA CARPETA Y ASÍ ACCEDER A LAS CLASES.
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router'; //SE USA PARA SUSCRIBIR CUANDO CAMBIA EL PARÁMETRO DEL ID.
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  constructor(clienteService : ClienteService, activatedRoute : ActivatedRoute) {
    this.clienteService = clienteService;
    this.activatedRoute = activatedRoute;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id : number = +params.get('id');                    //CON + SE CONVIENTE EL 'id' EN UN TIPO NUMBER.
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }

  /*
  //CLASE 105 : SIN BARRA DE CARGA DE IMAGEN

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    //ESTO VALIDA Q EL ARCHIVO SUBIDO TENGA UN TYPE = IMAGE
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error seleccionar imagen:', 'el archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      swal.fire('Error upload:', 'debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(cliente => {
        this.cliente = cliente;
        swal.fire('La imagen se Ha subido correctamente!', `Imagen: ${this.cliente.foto}`, 'success');
      });
    }
  }
  */

  //CLASE 105 : CON BARRA DE CARGA DE IMAGEN
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0; // SE REINICIA EL PROGRESO POR SI SE QUIERE CAMBIAR LA FOTO.
    console.log(this.fotoSeleccionada);
    //ESTO VALIDA Q EL ARCHIVO SUBIDO TENGA UN TYPE = IMAGE
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error seleccionar imagen:', 'el archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      swal.fire('Error upload:', 'debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event => {
        //=== SIGNIFICA "IDÉNTICO A"
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response : any = event.body;
          this.cliente = response.cliente as Cliente;
                                                           //ESTE VIENE DEL BACK
          swal.fire('La imagen se Ha subido correctamente!', response.mensaje, 'success');
        }
      });
    }
  }

  cliente : Cliente;
  private clienteService : ClienteService;
  private activatedRoute : ActivatedRoute;
  titulo : string = "Detalle de Cliente";
  fotoSeleccionada : File;
  progreso : Number = 0;
}
