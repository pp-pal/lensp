import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../model/post';
import { PostService } from '../services/post.service';
import { utils } from '../utils/utils';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.css']
})
export class DetailPostComponent implements OnInit {
  post!: Post;

  constructor(private postService: PostService, private route: ActivatedRoute, private utils: utils) { }

  ngOnInit(): void {
    const publicationId = this.route.snapshot.params['id'];

    this.postService.getSingle(publicationId).subscribe((result) => {
      console.log({result})
      this.post = {
        content: result.data.publication.metadata.content,
        userId: result.data.publication.profile.id,
        userName: result.data.publication.profile.name,
        postId: result.data.publication.id,
        profilePicture: this.utils.formatProfileUrl(result.data.publication.profile.picture.original.url),
        comments: result.data.publication.stats.totalAmountOfComments,
        collect: result.data.publication.stats.totalAmountOfCollects,
        mirrors: result.data.publication.stats.totalAmountOfMirrors
      }
      console.log(this.post);
    })
  }
}
