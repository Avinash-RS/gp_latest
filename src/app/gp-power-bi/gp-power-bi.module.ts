import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpPowerBIRoutingModule } from './gp-power-bi-routing.module';
import { GpPowerbiComponent } from './gp-powerbi/gp-powerbi.component';
import { SharedModule } from '../shared/shared.module';
import { GpMaterialModule } from '../shared/gp-material.module';


@NgModule({
  declarations: [GpPowerbiComponent],
  imports: [
    CommonModule,
    SharedModule,
    GpMaterialModule,
    GpPowerBIRoutingModule
  ]
})
export class GpPowerBIModule { }
