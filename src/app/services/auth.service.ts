import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { User } from '../models/user';
import { IUser } from '../interfaces';
import { Storage } from '@ionic/storage';
import { Platform, LoadingController } from '@ionic/angular';
import { auth } from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

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

  uid() {
    return this.user$
      .pipe(
        take(1),
        map(u => u && u.uid)
    )
    .toPromise();
  }


  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private loadingController: LoadingController,
    private gPlus: GooglePlus,
  ) {
    /* see if user exists by piping to a switch map that returns
    the user profile or returns a null observable if it's not created
    that */
    // this.user$ = this.afAuth.authState.pipe(
    //   switchMap(user => (user ? this.db.doc$(`users/${user.uid}`) : of(null)))
    // );

    this.handleRedirect();
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

  // Google auth

  setRedirect(val) {
    this.storage.set('authRedirect', val);
  }

  async isRedirect() {
    return await this.storage.get('authRedirect');
  }

  async googleLogin() {
    try {
      let user;
      if (this.platform.is('cordova')) user = await this.nativeGoogleLogin();
      else {
        await this.setRedirect(true);
        const provider = new auth.GoogleAuthProvider();
        user = await this.afAuth.auth.signInWithRedirect(provider);
      }

      return await this.updateUserData(user);

    } catch (err) {
      console.log(err);
    }
  }

  // Handle loginwith redirecgt for web google auth
  private async handleRedirect() {
    if (await this.isRedirect() !== true) return null;

    const loading = await this.loadingController.create();
    await loading.present();

    const result = await this.afAuth.auth.getRedirectResult();

    if (result.user) await this.updateUserData(result.user);

    await loading.dismiss();
    return result;

  }

  async nativeGoogleLogin(): Promise<any> {
    const gplusUser = await this.gPlus.login({
      webClientId: '171497883597-onh929rhfmqk2760j05vg39ieir8mn1l.apps.googleusercontent.com',
      offline: true,
      scopes: 'profile email'
    });

    return await this.afAuth.auth.signInWithCredential(
      auth.GoogleAuthProvider.credential(gplusUser.idToken)
    );
  }

}
