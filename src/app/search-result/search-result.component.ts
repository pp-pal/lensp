import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Profile } from '../model/profile';
import { SearchService } from '../services/search.service';
import { utils } from '../utils/utils';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  searchResult: Profile[] = [];

  constructor(private activeRouter: ActivatedRoute, private searchService: SearchService, private utils: utils) { }

  ngOnInit(): void {
    const keyword = this.activeRouter.snapshot.params['keyword'];
    this.searchService.profile(keyword)
      .subscribe((result) => {
        console.log({result})
        const items = result.data.search.items as Array<any>;
        items.forEach((item) => {
          this.searchResult.push({
            bio: item.bio,
            userId: item.profileId,
            userName: item.handle,
            profilePicture: this.utils.getProfilePicture(item),
            comments: item.stats.totalComments,
            collect: item.stats.totalCollects,
            mirrors: item.stats.totalMirrors,
            follower: item.stats.totalFollowers,
            following: item.stats.totalFollowing,
            post: item.stats.totalPosts,
            publications: item.stats.totalPublications
          })
        })


        console.log({ result: this.searchResult })
      })
  }
}
