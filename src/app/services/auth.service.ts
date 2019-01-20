import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  private updateUserData(user: any) {
    const { uid, email, displayName, photoUrl, isAnonymous } = user;
    const path = `users/${uid}`;
    const data = new User(uid, email, displayName, photoUrl, isAnonymous);
    return this.db.updateAt(path, data);
    return;
  }


  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
  ) {

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null)))
    );
  }

  async anonymousLogin() {
    const credential = await this.afAuth.auth.signInAnonymously();
    const { user } = credential;
    return await this.updateUserData(user);
  }

}
