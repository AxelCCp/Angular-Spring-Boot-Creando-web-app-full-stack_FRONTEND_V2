import { Injectable } from '@angular/core';
//import {CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { of } from 'rxjs';                //EL OF ES PARA CONVERTIR UN OBJ EN UN OBSERVABLE.
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';  //PARA MANEJAR LOS ERRORES QUE VIENEN DEL BACK.BUSCA SI HAY ERRORES EN EL OBSERVABLE.
import swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { tap } from 'rxjs/operators';
import { HttpRequest } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { Region} from './region';
import { AuthService } from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(http : HttpClient, router : Router, authService : AuthService) {
    this.http = http;
    this.router = router;
    this.authService = authService;
  }


  //ESTO ES CON PAGE
  public getClientes(page:number) : Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
            //CAST A ANY
      tap((response : any)  => {
        console.log('ClienteService : tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),

      map((response : any) => {
         (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.apellido = cliente.apellido.toUpperCase();
          cliente.email = cliente.email.toUpperCase();
          cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); //MÁS OPCIONES EN CLASE 78
          return cliente;
        });
        return response;
      }),

      tap(response => {
        console.log('ClienteService : tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),

    );
  }


  public create(cliente : Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers : this.httpHeaders}) //DENTRO DE UN OBJ SE PASA EL httpHeaders.
    .pipe(
      map((response : any) => response.cliente as Cliente),
      catchError( e => {

        if(this.isNoAutorizado(e) == true){
          return throwError(e);
        }

        //MANEJANDO EL ERROR Q VIENE DESDE LA VALIDACIÓN DE SPRING
        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
    }));
  }


  public getCliente(id) : Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
    .pipe(catchError(e => {

      if(this.isNoAutorizado(e) == true){
        return throwError(e);
      }

      this.router.navigate(['/clientes']);
      console.error(e.error.mensaje);
      swal.fire('Error al editar', e.error.mensaje, 'error');
      return throwError(e);
    }));
  }


  public update(cliente : Cliente) : Observable<any> {
                                                      //id cliente     cliente con sus datos para el update      y las cabeceras.
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers : this.httpHeaders})
    .pipe(catchError( e => {

      if(this.isNoAutorizado(e) == true){
        return throwError(e);
      }

      //MANEJANDO EL ERROR Q VIENE DESDE LA VALIDACIÓN DE SPRING
      if(e.status==400){
        return throwError(e);
      }

      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    }));
  }



  public delete(id : number) : Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers : this.httpHeaders})
    .pipe(catchError( e => {

      if(this.isNoAutorizado(e) == true){
        return throwError(e);
      }

      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    }));
  }

  //CLASE 105 : CON BARRA DE CARGA DE IMAGEN
  subirFoto(archivo : File, id) : Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }


  getRegiones() : Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones').pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }


  //RECIBE EL ERROR, SEGÚN LOS PERMISOS Q TENGA EL USUARIO PARA INGRESAR A UNA RUTA.
  private isNoAutorizado(e) : boolean {
    //401 : NO AUTORIZADO //403 : RECURSO PROHIBIDO
    if(e.status==401 || e.status==403){
      this.router.navigate(['/login']);
      return true
    }
    return false;
  }


  private agregarAuthorizationHeader(){
    //TOKEN ES EL MÉTODO GETTER Q ACCEDE A TOKEN. EL GETTER LO VA AA BUSCAR AL ATRIBUTO PRIVADO _TOKEN Y SI NO LO ENCUENTRA LO VA A BUSCAR AL sessionStorage.
    let token = this.authService.token;
  }

  private http : HttpClient;
  private urlEndPoint : string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'})
  private router : Router;
  private authService : AuthService;
}
