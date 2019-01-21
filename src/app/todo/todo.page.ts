import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { DbService } from '../services/db.service';
import { AuthService } from '../services/auth.service';

import { ModalController } from '@ionic/angular';
import { TodoFormComponent } from './todo-form/todo-form.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todos;
  filtered;

  filter = new BehaviorSubject(null);


  constructor(
    public db: DbService,
    public modal: ModalController,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.todos = this.auth.user$.pipe(
      switchMap(user =>
        this.db.collection$('todos', ref =>
          ref
            .where('uid', '==', user['uid'])
            .orderBy('createdAt', 'desc')
            .limit(25)
        )
      ),
      shareReplay(1)
    );
  }

  trackById(idx, todo) {
    return todo.id;
  }

}
