import { Component, Inject, OnInit } from '@angular/core';
import { Profile } from '../model/profile';
import { ProfileService } from '../services/profile.service';
import { WalletService } from '../services/wallet.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalPopupComponent } from '../shared/modal-popup/modal-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { utils } from '../utils/utils';
import { SearchPopupComponent } from '../shared/search-popup/search-popup.component';
import { Route, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AddProfilePopupComponent } from '../shared/add-profile-popup/add-profile-popup.component';
import { v4 as uuidv4, v4 } from 'uuid';
import { example1 } from '../metadata/example.metadata';
import { PostService } from '../services/post.service';
import { CreatePostPopupComponent } from '../shared/create-post-popup/create-post-popup.component';
import { IsIndexedPopupComponent } from '../shared/is-indexed-popup/is-indexed-popup.component';

@Component({
  selector: 'app-list-popular-profile',
  templateUrl: './list-popular-profile.component.html',
  styleUrls: ['./list-popular-profile.component.css']
})
export class ListPopularProfileComponent implements OnInit {
  listProfiles: Profile[] = [];
  isWalletConnected: boolean = false;
  isLogin: boolean = false;

  constructor(
    private profileService: ProfileService,
    private walletService: WalletService,
    private userService: UserService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private utils: utils,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.userService.isLogin()
      .then((result) => { this.isLogin = result })
      .catch((error) => {
        console.log({ error })
      })
    this.walletService.isConnected()
      .then((_) => {
        this.isWalletConnected = true;
      })
      .catch((_) => {
        this.isWalletConnected = false;
      })
    this.profileService.listPopular().subscribe((result) => {
      const rawProfiles = result.data.recommendedProfiles as Array<any>;
      rawProfiles.forEach((profile) => {
        this.listProfiles.push({
          userName: profile.name,
          bio: profile.bio,
          userId: profile.id,
          profilePicture: this.utils.formatProfileUrl(profile.picture?.original?.url),
          comments: profile.stats.totalComments,
          collect: profile.stats.totalCollects,
          mirrors: profile.stats.totalMirrors,
          follower: profile.stats.totalFollowers,
          following: profile.stats.totalFollowing,
          post: profile.stats.totalPosts,
          publications: profile.stats.totalPublications
        })
      })
    })
  }

  connectWallet() {
    this.walletService.connect()
      .then((_) => {
        const message = 'Connected to wallet!'
        this.snackbar.open(message);
      })
      .catch((error) => {
        console.log({ error })
        let title, description;
        if (error.error == this.walletService.NO_INSTALLED_WALLET) {
          title = 'Have you installed your Wallet?'
          description = `There doesn't seem to be an active Metamask. Install or login your Metamask to connect.`
        } else {
          title = 'Something went wrong.'
          description = 'Unexpected error happened. Contact support for help.'
        }
        this.dialog.open(ModalPopupComponent, { data: { title, description } });
      })
  }

  openSearchDialog() {
    const searchDialog = this.dialog.open(SearchPopupComponent);
    searchDialog.afterClosed().subscribe((result) => {
      if (result) {
        const keyword = encodeURI(result)
        this.router.navigateByUrl(`/search/${keyword}`)
      }
    })
  }

  openCreateProfileDialog() {
    const addprofileDialog = this.dialog.open(AddProfilePopupComponent);
  }

  login() {
    this.userService.login()
      .then((result) => {
        console.log({ result })
      })
      .catch((exc) => {
        console.log({ exc })
        const title = 'Error login';
        const description = exc as string;
        this.dialog.open(ModalPopupComponent, { data: { title, description } });
      })
  }

  myProfile() {
    this.userService.getMyProfile()
      .then((result) => {
        this.router.navigateByUrl("/user/" + result.data.profiles.items[0].id)
      })
      .catch((err) => { console.log({ err }) })
  }

  updateProfilePic() {
    this.userService.updateProfilePicture("0x4da3", "ipfs://QmaxQMfckGZQzvGYc9fcz5K4xF5sb6jYqMcbmi4j5ndh76")
      .then((updateProfile) => { console.log({ updateProfile }) });
  }

  // test() {
  //   // this.utils.validateMetaData(example1);
  //   const profileId = "0x4da3";
  //   const contentURI = "ipfs://Qma2R8nfaNY9AMgoGLSHihuqU8TY2Rz2yoQrcitzva4sqD";
  //   // this.postService.createPost(profileId, contentURI)
  //   //   .then((result) => { console.log({ result }) })
  //   //   .catch((err) => { console.log({ err }) })
  // }

  generateUuid() {
    console.log(uuidv4());
  }

  createPost() {
    this.dialog.open(CreatePostPopupComponent);
  }

  isIndexed() {
    this.dialog.open(IsIndexedPopupComponent);
  }

  logout() {
    this.userService.logout();
  }
}
