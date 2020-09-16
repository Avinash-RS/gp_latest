import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpPowerbiComponent } from './gp-powerbi/gp-powerbi.component';


const powerroutes: Routes = [
  {
    path: '',
    component: GpPowerbiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(powerroutes)],
  exports: [RouterModule]
})
export class GpPowerBIRoutingModule { }
