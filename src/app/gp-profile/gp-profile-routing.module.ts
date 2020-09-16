import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpProfileUpdateComponent } from './gp-profile-update/gp-profile-update.component';


const profileroutes: Routes = [
  {
    path: '',
    component: GpProfileUpdateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(profileroutes)],
  exports: [RouterModule]
})
export class GpProfileRoutingModule { }
