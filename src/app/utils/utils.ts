import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { broadcastTx, isIndexed, refreshToken } from "../queries/user.query";
import { catchError, Observable, of } from 'rxjs';
import { ethers, Wallet } from 'ethers';
import * as ethUtils from '@metamask/eth-sig-util';
import { validatePublicationMetadata } from "../queries/publication.query";
import { environment } from "src/environments/environment";

// @ts-ignore
import omitDeep from 'omit-deep';

@Injectable({
    providedIn: 'root'
})
export class utils {
    readonly ipfsResolver = 'https://ipfs.io/ipfs/';
    readonly EMPTY_ACCOUNT = 'empty_account';
    ethereum: any;
    wallet: ethers.Wallet;
    constructor(private apollo: Apollo, private httpLink: HttpLink) {
        const { ethereum } = <any>window
        this.ethereum = ethereum
        this.wallet = new Wallet(environment.PK, new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today"));
    }

    formatProfileUrl(url: string | undefined): string | undefined {
        if (url) {
            const isIpfsLink = url.includes('ipfs://')
            if (isIpfsLink) {
                url = url.replace('ipfs://', this.ipfsResolver);
            }
        }

        return url;
    }

    getProfilePicture(profile: { picture: { original: { url: string | undefined; }; uri: string | undefined; }; }) {
        let profilePicture: string | undefined;
        if (profile.picture?.original?.url) {
            profilePicture = profile.picture.original.url;
        } else if (profile.picture?.uri) {
            profilePicture = profile.picture.uri;
        } else {
            profilePicture = undefined;
        }

        profilePicture = this.formatProfileUrl(profilePicture);

        return profilePicture;
    }

    async getUserHeader(): Promise<HttpHeaders> {
        return new Promise((resolve, reject) => {
            let header = new HttpHeaders();
            const token = window.localStorage.getItem('aToken');
            const rToken = window.localStorage.getItem('rToken');
            if (token) {
                var decoded = jwt_decode(token) as decodedFormat;
                console.log({ decoded });
                var seconds = new Date().getTime() / 1000;
                if (decoded.exp < seconds && rToken) {
                    console.log('need refresh token')
                    this.apollo.mutate({
                        mutation: refreshToken,
                        variables: {
                            token: rToken
                        }
                    }).pipe(
                        catchError((err) => { //debug error
                            console.log({ err })
                            return of(err)
                        })
                    ).subscribe((rtoken) => {
                        console.log({ rtoken })
                        window.localStorage.setItem('aToken', rtoken.data.refresh.accessToken);
                        window.localStorage.setItem('rToken', rtoken.data.refresh.refreshToken);
                        resolve(header.set('x-access-token', 'Bearer ' + rtoken.data.refresh.accessToken));
                    })
                } else {
                    console.log('else 2 with kek')
                    resolve(header.set('x-access-token', 'Bearer ' + token));
                }
            } else {
                console.log('else 1')
                resolve(header);
            }
        })
    }

    broadcastPost(data: postTyped): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const domain = omitDeep(data.typedData.domain, '__typename');
                const types = omitDeep(data.typedData.types, '__typename');
                const value = omitDeep(data.typedData.value, '__typename');
                const signature = await this.wallet._signTypedData(
                    domain,
                    types,
                    value
                )

                const request = {
                    id: data.id,
                    signature
                }
                const headers = await this.getUserHeader();

                this.apollo.mutate({
                    mutation: broadcastTx,
                    variables: {
                        request
                    },
                    context: { headers }
                }).pipe(
                    catchError((err) => { //debug error
                        return of(err)
                    })
                ).subscribe((broadcastResult) => {
                    resolve(broadcastResult);
                })
            } catch (error) {
                reject({ error })
            }
        })
    }

    broadcastData(data: defaultTypedData) {
        return new Promise(async (resolve, reject) => {
            try {
                const domain = omitDeep(data.typedData.domain, '__typename');
                const types = omitDeep(data.typedData.types, '__typename');
                const value = omitDeep(data.typedData.value, '__typename');
                let formatedData = omitDeep(data.typedData, '__typename');
                formatedData.primaryType = "SetProfileImageURIWithSig";
                formatedData.message = formatedData.value;
                delete formatedData.value;
                console.log({ formatedData })
                const msgParams = JSON.stringify(omitDeep(formatedData))
                const accounts = await this.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length == 0) {
                    reject(this.EMPTY_ACCOUNT)
                } else {
                    const signature = await this.wallet._signTypedData(
                        domain,
                        types,
                        value
                    )

                    console.log({ signature })

                    const request = {
                        id: data.id,
                        signature
                    }
                    const headers = await this.getUserHeader();

                    this.apollo.mutate({
                        mutation: broadcastTx,
                        variables: {
                            request
                        },
                        context: { headers }
                    }).pipe(
                        catchError((err) => { //debug error
                            console.log({ err })
                            return of(err)
                        })
                    ).subscribe((broadcastResult) => {
                        console.log({ broadcastResult })
                        resolve(broadcastResult);
                    })
                }
            } catch (error) {
                console.log({ error })
                reject(error)
            }
        })
    }

    isIndexed(txId: string) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('before')
                const headers = await this.getUserHeader();
                console.log('after')

                this.apollo.query({
                    query: isIndexed,
                    variables: {
                        id: txId
                    },
                    context: { headers }
                }).pipe(
                    catchError((err) => { //debug error
                        console.log({ err })
                        return of(err)
                    })
                ).subscribe((isIndexed) => {
                    console.log({ isIndexed })
                    resolve(isIndexed);
                })
            } catch (error) {
                reject({ error })
            }
        })
    }

    validateMetaData(metadata: metadataType) {
        return new Promise((resolve, reject) => {
            try {
                this.apollo.query({
                    query: validatePublicationMetadata,
                    variables: {
                        request: metadata
                    }
                }).pipe(
                    catchError((err) => { //debug error
                        console.log({ err })
                        return of(err)
                    })
                ).subscribe((metadataResult) => {
                    console.log({ metadataResult })
                    resolve(metadataResult);
                })
            } catch (error) {
                reject({ error })
            }
        })
    }
}

export type decodedFormat = {
    "id": string,
    "role": string,
    "iat": number,
    "exp": number
}

export type defaultTypedData = {
    "id": string,
    "expiresAt": string,
    "typedData": {
        "types": {
            "SetProfileImageURIWithSig": [
                {
                    "name": string,
                    "type": string,
                    "__typename": string
                }
            ],
            "__typename": string
        },
        "domain": {
            "name": string,
            "chainId": number,
            "version": string,
            "verifyingContract": string,
            "__typename": string
        },
        "value": {
            "nonce": number,
            "deadline": number,
            "imageURI": string,
            "profileId": string,
            "__typename": string
        },
        "__typename": string
    },
    "__typename": string
}

export type profileTyped = {
    "data": {
        "createSetProfileImageURITypedData": {
            "id": string,
            "expiresAt": string,
            "typedData": {
                "types": {
                    "SetProfileImageURIWithSig": [
                        {
                            "name": string,
                            "type": string,
                            "__typename": string
                        }
                    ],
                    "__typename": string
                },
                "domain": {
                    "name": string,
                    "chainId": number,
                    "version": string,
                    "verifyingContract": string,
                    "__typename": string
                },
                "value": {
                    "nonce": number,
                    "deadline": number,
                    "imageURI": string,
                    "profileId": string,
                    "__typename": string
                },
                "__typename": string
            },
            "__typename": string
        }
    },
    "loading": boolean
}

export type postTyped = {
    "id": string,
    "expiresAt": string,
    "typedData": {
        "types": {
            "PostWithSig": [
                {
                    "name": string,
                    "type": string,
                    "__typename": string
                }
            ],
            "__typename": string
        },
        "domain": {
            "name": string,
            "chainId": number,
            "version": string,
            "verifyingContract": string,
            "__typename": string
        },
        "value": {
            "nonce": number,
            "deadline": number,
            "imageURI": string,
            "profileId": string,
            "contentURI": string,
            "collectModule": string,
            "collectModuleInitData": string,
            "referenceModule": string,
            "referenceModuleInitData": string
            "__typename": string
        },
        "__typename": string
    },
    "__typename": string
}

export type metadataType = {
    "version": any,
    "mainContentFocus": any,
    "metadata_id": any,
    "description": any,
    "locale": any,
    "content": any,
    "external_url": any,
    "image": any,
    "imageMimeType": any,
    "name": any,
    "attributes": any,
    "tags": any,
    "appId": any
}