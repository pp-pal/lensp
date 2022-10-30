import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../model/post';
import { Profile } from '../model/profile';
import { PostService } from '../services/post.service';
import { ProfileService } from '../services/profile.service';
import { utils } from '../utils/utils';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit {
  listPost: Post[] = [];
  userProfile: Profile[] = [];

  constructor(private postService: PostService, private profileService: ProfileService, private route: ActivatedRoute, private utils: utils) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.profileService.getProfileById(userId)
      .then((result) => {
        console.log({ result })
        this.userProfile.push({
          bio: result.data.profile.bio,
          userId: result.data.profile.id,
          userName: result.data.profile.handle,
          profilePicture: this.utils.getProfilePicture(result.data.profile),
          comments: result.data.profile.stats.totalComments,
          collect: result.data.profile.stats.totalCollects,
          mirrors: result.data.profile.stats.totalMirrors,
          follower: result.data.profile.stats.totalFollowers,
          following: result.data.profile.stats.totalFollowing,
          post: result.data.profile.stats.totalPosts,
          publications: result.data.profile.stats.totalPublications
        })
      }).catch((error) => { console.log({ error }) })

    this.postService.listByUser(userId).subscribe((result) => {
      console.log({ result })
      const rawPosts = result.data.publications.items as Array<any>;
      rawPosts.forEach((result) => {
        this.listPost.push({
          postId: result.id,
          content: result.metadata.content,
          userId: result.profile.id,
          userName: result.profile.name,
          profilePicture: this.getProfilePicture(result.profile),
          comments: result.stats.totalAmountOfComments,
          collect: result.stats.totalAmountOfCollects,
          mirrors: result.stats.totalAmountOfMirrors
        })
      });
      console.log(this.listPost)
    })
  }

  private getProfilePicture(profile: { picture: { original: { url: string | undefined; }; uri: string | undefined; }; }) {
    let profilePicture: string | undefined;
    if (profile.picture?.original?.url) {
      profilePicture = profile.picture.original.url;
    } else if (profile.picture?.uri) {
      profilePicture = profile.picture.uri;
    } else {
      profilePicture = undefined;
    }

    profilePicture = this.utils.formatProfileUrl(profilePicture);

    return profilePicture;
  }
}
