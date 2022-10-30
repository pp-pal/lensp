import { Injectable } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, Observable, of } from 'rxjs';
import { getProfileById, popularProfile } from '../queries/profile.query';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    uri = 'https://api.lens.dev'
    constructor(private apollo: Apollo) { }

    listPopular(): Observable<any> {
        return this.apollo.query({ query: popularProfile });
    }

    getProfileById(profileId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.apollo.query({
                    query: getProfileById,
                    variables: { profileId }
                }).pipe(
                    catchError((err) => { //debug error
                        console.log({ err })
                        return of(err)
                    })
                ).subscribe((profileResult) => {
                    console.log({ profileResult })
                    resolve(profileResult)
                })
            } catch (error) {
                reject({ error })
            }
        })
    }
}
