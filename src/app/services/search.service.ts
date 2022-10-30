import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, Observable, of } from 'rxjs';
import { searchProfile, searchPublication } from '../queries/search.query';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(private apollo: Apollo) { }

    publication(keyword: string): Observable<any> {
        return this.apollo.query({ query: searchPublication, variables: { keyword } });
    }

    profile(keyword: string): Observable<any> {
        console.log('searching for ', { keyword })
        return this.apollo.query({ query: searchProfile, variables: { keyword } })
            .pipe(
                catchError((err) => { //debug error
                    console.log({ err })
                    return of(err)
                })
            );
    }
}
