import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RequestFormComponent} from "./request-form/request-form.component";

const routes: Routes = [
  { path: '', component: RequestFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
