import { IUser } from '../interfaces';

export class User {
  private _user: IUser;

  get user() {
    return this._user;
  }

  constructor(uid, email, displayName, photoUrl, isAnonymous) {
    const _user = { uid, email, displayName, photoUrl, isAnonymous };
  }
}
