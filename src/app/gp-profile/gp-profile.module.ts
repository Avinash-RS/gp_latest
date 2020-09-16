import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpProfileRoutingModule } from './gp-profile-routing.module';
import { GpProfileUpdateComponent } from './gp-profile-update/gp-profile-update.component';
import { SharedModule } from '../shared/shared.module';
import { GpMaterialModule } from '../shared/gp-material.module';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [GpProfileUpdateComponent],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWb8W2cEFg6Wk_x2jVNsL9xd2Awkmho44',
      libraries: ['places']
    }),
    CommonModule,
    GpProfileRoutingModule,
    SharedModule,
    GpMaterialModule
  ]
})
export class GpProfileModule { }
