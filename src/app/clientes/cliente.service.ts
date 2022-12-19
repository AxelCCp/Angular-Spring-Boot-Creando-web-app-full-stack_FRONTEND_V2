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

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(http : HttpClient, router : Router) {
    this.http = http;
    this.router = router;
  }


//ESTO ES CON LIST
/*
  public getClientes() : Observable<Cliente[]>{
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);      //<Cliente[]> ES UN CAST YA Q EL GET DEVUELVE UN ANY.
    return this.http.get(this.urlEndPoint).pipe(

      tap(response => {
        let clientes = response as Cliente[];
        console.log('ClienteService : tap 1');
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),

      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.apellido = cliente.apellido.toUpperCase();
          cliente.email = cliente.email.toUpperCase();
          cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); //MÁS OPCIONES EN CLASE 78
          return cliente;
        });
      }),

      tap(response => {
        console.log('ClienteService : tap 2');
        response.forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),

    );
  }*/

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
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    }));
  }

  /*
  //SIN BARRA DE CARGA DE IMAGEN
  subirFoto(archivo : File, id) : Observable<Cliente> {
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', '/upload/file', file, {
      reportProgress: true
    });

    return this.http.post(`${this.urlEndPoint}/upload`,formData).pipe(
      map((response : any) => response.cliente as Cliente),
      catchError(
        e => {
         console.error(e.error.mensaje);
         swal.fire(e.error.mensaje, e.error.error, 'error');
         return throwError(e);
       }
      )
    );
  }
  */

  //CLASE 105 : CON BARRA DE CARGA DE IMAGEN
  subirFoto(archivo : File, id) : Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }


  private http : HttpClient;
  private urlEndPoint : string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'})
  private router : Router;
}
