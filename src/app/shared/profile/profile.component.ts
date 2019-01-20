import { Component, OnInit, Input } from '@angular/core';
import { IUser } from 'src/app/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() user: any;

  constructor() { }

  ngOnInit() {
    console.log(this.user);
  }

}
