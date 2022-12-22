import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent {
  form: FormGroup; 
  loading=false;
titulo="crear tarjeta";
id:string | undefined;
  constructor(private fb: FormBuilder, private _tarjetaService:TarjetaService, private toastr: ToastrService){
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    });

    this._tarjetaService.getTarjetaEdit().subscribe(notificaciones =>{
      this.id=notificaciones.id;
      console.log(notificaciones)
      this.titulo="Editar tarjeta"
      this.form.patchValue({
        titular:notificaciones.titular,
        numeroTarjeta:notificaciones.numeroTarjeta,
        fechaExpiracion:notificaciones.fechaExpiracion,
        cvv:notificaciones.cvv
      });
    });
  }

  crearTarjeta(){
    if(this.id===undefined){

      this.loading=true;
      const TARJETA:TarjetaCredito = {
        titular:this.form.value.titular,
        numeroTarjeta:this.form.value.numeroTarjeta,
        fechaExpiracion:this.form.value.fechaExpiracion,
        cvv:this.form.value.cvv,
        fechaCreacion:new Date(),
        fechaActualizacion:new Date()
      }
      this._tarjetaService.guardarTarjeta(TARJETA)
      .then(()=>{
        console.log('Tarjeta registrada');
        this.form.reset();
        this.toastr.success('La tarjeta fue registrada con exito!','Tarjeta registrada');
        this.loading=false;
      })
      .catch(error=>{
        this.toastr.error('Opps. Ocurrio un error, intentelo de nuevo.','Error');
        console.log(error);
        this.loading=false;
      })
      ;
    }else{
      const TARJETA:any = {
        titular:this.form.value.titular,
        numeroTarjeta:this.form.value.numeroTarjeta,
        fechaExpiracion:this.form.value.fechaExpiracion,
        cvv:this.form.value.cvv,

        fechaActualizacion:new Date()
      }
      this.loading=true;
      this._tarjetaService.editarTarjeta(this.id, TARJETA)
      .then(()=> {
        this.loading=false;
        this.titulo="Crear tarjeta";
        this.form.reset();
        this.id= undefined;
        this.toastr.info('La tarjeta fue actualizada con exito!', 'Registro actualizado');
      })
      .catch(error=>{
        console.log(error);
      });
      
    }


  }
}
