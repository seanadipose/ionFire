import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo.page';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { SharedModule } from '../shared/shared.module';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TodoPage
  },
  {
    path: ':id',
    component: TodoDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TodoPage, TodoFormComponent, TodoDetailComponent],
  entryComponents: [TodoFormComponent]
})
export class TodoPageModule {}
