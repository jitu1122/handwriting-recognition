import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FileUploaderComponent} from './file-uploader/file-uploader.component';
import {PreviousResultsComponent} from './previous-results/previous-results.component';


const routes: Routes = [
  {
    path: '',
    component: FileUploaderComponent
  },
  {
    path: 'previous-results',
    component: PreviousResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
