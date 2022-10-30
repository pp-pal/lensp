import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { WalletService } from 'src/app/services/wallet.service';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';

@Component({
  selector: 'app-create-post-popup',
  templateUrl: './create-post-popup.component.html',
  styleUrls: ['./create-post-popup.component.css']
})
export class CreatePostPopupComponent implements OnInit {
  postCID = '';

  constructor(
    public dialogRef: MatDialogRef<CreatePostPopupComponent>,
    private userService: UserService,
    private postService: PostService,
    private walletService: WalletService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const duration = 1500;
    this.dialogRef.afterClosed()
      .subscribe(async (result) => {
        try {
          this.userService.getMyProfile()
            .then((result) => {
              console.log({ result })
              if (result.data.profiles.items.length > 0 && this.postCID.length > 5) {
                const profileId = result.data.profiles.items[0].id;
                const contentURI = "ipfs://" + this.postCID;
                console.log({ profileId, contentURI })
                this.postService.createPost(profileId, contentURI)
                  .then((result) => {
                    console.log({ result })
                    this.snackbar.open('Created post, check for tx status', '', { duration });
                    this.dialogRef.close();
                    const title = 'Post Created';
                    const description = `Check isIndexed status for txId : ${result.data.broadcast.txId}`
                    this.dialog.open(ModalPopupComponent, { data: { title, description } });
                  })
                  .catch((err) => {
                    console.log({ err })
                    this.snackbar.open('Error', '', { duration });
                    this.dialogRef.close();
                  })
              } else {
                this.snackbar.open('No connected Wallet or Invalid CID', '', { duration });
                this.dialogRef.close();
              }
            })
            .catch((error) => {
              console.log({ error })
            })
        } catch (error) {
          console.log({ error })
        }
      })
  }

  cancel() {
    this.dialogRef.close();
  }
}
