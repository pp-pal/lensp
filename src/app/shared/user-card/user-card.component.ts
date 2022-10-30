import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/model/profile';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input()
  users: Profile[] | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
