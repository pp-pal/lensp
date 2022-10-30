import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.css']
})
export class SearchPopupComponent implements OnInit {
  keyword = '';

  constructor(public dialogRef: MatDialogRef<SearchPopupComponent>) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
}
