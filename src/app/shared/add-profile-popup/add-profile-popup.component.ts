import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-profile-popup',
  templateUrl: './add-profile-popup.component.html',
  styleUrls: ['./add-profile-popup.component.css']
})
export class AddProfilePopupComponent implements OnInit {
  name = '';

  constructor(public dialogRef: MatDialogRef<AddProfilePopupComponent>, private userService: UserService) { }

  ngOnInit(): void {
    this.dialogRef.afterClosed()
      .subscribe((result) => {
        this.userService.createProfile(result);
      })
  }

  cancel() {
    this.dialogRef.close();
  }
}
