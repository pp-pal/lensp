import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { utils } from '../../utils/utils';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';

@Component({
  selector: 'app-is-indexed-popup',
  templateUrl: './is-indexed-popup.component.html',
  styleUrls: ['./is-indexed-popup.component.css']
})
export class IsIndexedPopupComponent implements OnInit {
  txId = '';
  constructor(
    public dialogRef: MatDialogRef<IsIndexedPopupComponent>,
    private utils: utils,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const duration = 1500;
    this.dialogRef.afterClosed()
      .subscribe((result) => {
        try {
          if (this.txId.length > 5) {
            this.utils.isIndexed(this.txId)
              .then((result) => {
                this.dialogRef.close();
                console.log({ result })
                const title = 'Indexing status';
                const description = JSON.stringify(result)
                this.dialog.open(ModalPopupComponent, { data: { title, description } });
              })
              .catch((err) => {
                this.dialogRef.close();
                console.log({ err })
                this.snackbar.open('Error', '', { duration })
              })
          } else {
            this.dialogRef.close();
            this.snackbar.open('Invalid txId', '', { duration })
          }
        } catch (error) {
          console.log({ error })
          this.dialogRef.close();
          this.snackbar.open('Error', '', { duration })
        }
      })

  }

  cancel() {
    this.dialogRef.close();
  }

}
