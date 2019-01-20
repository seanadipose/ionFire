import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

/*
Router guard to check local storage and validate that the user
has completed the tutorial slider.
It checks the ionic storage value of tutorial complete.
Tutorial complete is set in the tutorial.page component
*/

@Injectable({
  providedIn: 'root'
})
export class TutorialGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isComplete = await this.storage.get('tutorialComplete');
    if (!isComplete) {
      this.router.navigateByUrl('/tutorial');
    }
    return isComplete;
  }
}
