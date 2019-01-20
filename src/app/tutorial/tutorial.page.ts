import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  constructor(
    private storage: Storage,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async finish() {
    await this.storage.set('tutorialComplete', true);
  }

}
