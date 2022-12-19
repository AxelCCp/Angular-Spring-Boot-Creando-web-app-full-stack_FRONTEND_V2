import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; //PARA LA CONEXIÓN CON EL BACK
import { FormComponent } from './clientes/form.component';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './clientes/detalle/detalle.component';   //PARA TRABAJAR CON FORMULARIOS.
//import { MatDatepickerModule } from '@angular/material/core'
//import { /*MatDatepickerModule*/  MatNativeDateModule } from '@angular/material/core'

const routes : Routes = [
  {path:'', redirectTo:'/clientes', pathMatch:'full'},    //ESTE ES EL HOME Y REDIRIGE A CLIENTES. PATHMATCH FULL : HACE MATCH COMPLETO CON LA URL.
  {path:'directivas', component:DirectivaComponent},
  {path:'clientes', component:ClientesComponent},  //RUTA CON LIST
  {path:'clientes/form', component:FormComponent},
  {path:'clientes/form/:id', component:FormComponent},
  {path:'clientes/page/:page', component:ClientesComponent}, //RUTA CON PAGE
  //{path:'clientes/ver/:id', component:DetalleComponent},    //SE QUITA PQ SE CAMBIA POR UN MODAL.
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    //MatDatepickerModule,
    //MatNativeDateModule
  ],
  providers: [ClienteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
