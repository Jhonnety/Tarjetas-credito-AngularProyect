import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent {
  listTarjetas:TarjetaCredito[] = []
  constructor(private _tarjetService:TarjetaService, private toastr: ToastrService){

  }
  ngOnInit(): void {
    this.obtenerTarjetas();
  }
  obtenerTarjetas(){
this._tarjetService.obtenerTarjetas().subscribe(notificaciones =>{
  this.listTarjetas=[];
    notificaciones.forEach((element:any )=> {
      this.listTarjetas.push({
        id:element.payload.doc.id,
        ...element.payload.doc.data()
      });
    });
    console.log(this.listTarjetas)
});
  }
  
  eliminarTarjeta(id: any){
    this._tarjetService.eliminarTarjeta(id)
    .then(response=>{
      this.toastr.success('La tarjeta fue eliminada con exito!','Tarjeta eliminada');
    })
    .catch(error=>{
      this.toastr.error('Opps. Ocurrio un error, intentelo de nuevo.','Error');
      console.log(error);
    });
  }

  editarTarjeta(tarjeta:TarjetaCredito){
    this._tarjetService.addTarjetaEdit(tarjeta);
  }

}
