import { Injectable } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, Observable, of } from 'rxjs';
import { singlePublication, listPublicationByUser, createPostTypedData } from '../queries/publication.query';
import { utils } from '../utils/utils';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  uri = 'https://api.lens.dev'
  constructor(private apollo: Apollo, private utils: utils, private userService: UserService) { }

  listByUser(id: string = "0x01"): Observable<any> {
    return this.apollo.query({ query: listPublicationByUser, variables: { id } });
  }

  getSingle(publicationId: string): Observable<any> {
    return this.apollo.query({ query: singlePublication, variables: { publicationId } });
  }

  createPost(profileId: string, contentURI: string): Promise<any> {
    console.log('inside create post')
    return new Promise(async (resolve, reject) => {
      try {
        const isLogin = await this.userService.isLogin();
        if (isLogin) {
          const headers = await this.utils.getUserHeader();
          this.apollo.mutate({
            context: { headers },
            mutation: createPostTypedData,
            variables: { profileId, contentURI }
          }).pipe(
            catchError((err) => { //debug error
              return of(err)
            })
          ).subscribe((typedData) => {
            console.log({ typedData })
            this.utils.broadcastPost(typedData.data!.createPostTypedData)
              .then((result) => {
                resolve(result)
              })
              .catch((error) => {
                reject({ error })
              })
          })
        } else {
          reject('Not login')
        }
      } catch (error) {
        console.log({ error })
        reject({ error })
      }
    })

  }
}
