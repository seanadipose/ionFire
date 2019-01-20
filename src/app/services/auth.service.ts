import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  private updateUserData(user: any) {
    const { uid, email, displayName, photoUrl, isAnonymous } = user;
    const path = `users/${uid}`;
    const data = new User(uid, email, displayName, photoUrl, isAnonymous);
    this.user$ = of(data.user);
    // return this.db.updateAt(path, data);
  }

  private userDeconstruct(creds: firebase.auth.UserCredential): IUser {
    const { user: { uid, photoURL, isAnonymous, email, displayName }} = creds;
    const user = new User(uid, email, displayName, photoURL, isAnonymous);
    return user.user;

  }


  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
  ) {
    /* see if user exists by piping to a switch map that returns
    the user profile or returns a null observable if it's not created
    that */
    // this.user$ = this.afAuth.authState.pipe(
      // switchMap(user => (user ? this.db.doc$(`users/${user.uid}`) : of(null)))
    // );
  }

  // anonymouse login method to log user in and create new one.

  async anonymousLogin() {
    const credential = await this.afAuth.auth.signInAnonymously();
    const user = this.userDeconstruct(credential);
    return await this.updateUserData(user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.user$ = of(null);
    const test = await this.router.navigate(['/']);
  }

}
