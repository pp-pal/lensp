import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { authenticate, challengeText, createProfile, generateUpdateProfilePicture, myProfile } from '../queries/user.query';
import { Buffer } from 'buffer';
import { WalletService } from './wallet.service';
import { environment } from 'src/environments/environment';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { utils } from '../utils/utils';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public ethereum;

    constructor(
        private apollo: Apollo,
        private walletService: WalletService,
        private httpLink: HttpLink,
        private utils: utils) {
        const { ethereum } = <any>window
        this.ethereum = ethereum
    }

    updateProfilePicture(profileId: string, url: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const headers = await this.utils.getUserHeader();
                console.log({ profileId, url, headers })

                this.apollo.mutate({
                    context: { headers },
                    mutation: generateUpdateProfilePicture,
                    variables: { profileId, url }
                }).pipe(
                    catchError((err) => { //debug error
                        console.log({ err })
                        return of(err)
                    })
                ).subscribe((typedData) => {
                    console.log({ typedData })
                    this.utils.broadcastData(typedData.data!.createSetProfileImageURITypedData)
                        .then((result) => {
                            console.log({ result })
                            resolve(typedData)
                        })
                })
            } catch (error) {
                console.log({ error })
                reject({ error })
            }
        });

    }

    getMyProfile(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.walletService.isConnected();
                if (Object.keys(data.data).length > 0) {
                    this.apollo.query({
                        query: myProfile,
                        variables: {
                            walletId: data.data[0]
                        }
                    }).pipe(
                        catchError((err) => { //debug error
                            console.log({ err })
                            return of(err)
                        })
                    ).subscribe((profileResult) => {
                        console.log({ profileResult })
                        resolve(profileResult)
                    })
                } else {
                    reject("No connected wallet");
                }
            } catch (error) {
                reject({ error })
            }
        });
    }

    createProfile(name: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await this.login();
                const headers = await this.utils.getUserHeader();
                this.apollo.mutate({
                    mutation: createProfile,
                    variables: {
                        handle: name
                    },
                    context: { headers }
                }).pipe(
                    catchError((err) => { //debug error
                        console.log({ err })
                        return of(err)
                    })
                ).subscribe((authResult) => {
                    console.log({ authResult })
                    resolve(authResult)
                })
            } catch (error) {
                console.log({ error })
                reject({ error })
            }
        })
    }

    login(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.walletService.isConnected()
                .then(async (result) => {
                    const aToken = window.localStorage.getItem('aToken');
                    const rToken = window.localStorage.getItem('rToken');
                    if (!aToken || !rToken) {
                        const address = result.data[0]
                        const textChallenge = await this.generateChallenge(address);
                        const signedText = await this.signText(address, textChallenge.data);
                        const loginStatus = await this.requestLogin(address, signedText.data);
                        console.log({ loginStatus })
                        console.log('setting login token')
                        window.localStorage.setItem('aToken', loginStatus.data.authenticate.accessToken);
                        window.localStorage.setItem('rToken', loginStatus.data.authenticate.refreshToken);
                        resolve(loginStatus)
                    } else {
                        reject('Already login')
                    }
                })
                .catch((error) => {
                    reject({ error })
                })
        });
    }

    isLogin(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const isWalletConnected = await this.walletService.isConnected();
                console.log({ isWalletConnected })
                const aToken = window.localStorage.getItem('aToken');
                const rToken = window.localStorage.getItem('rToken');
                console.log({ aToken, rToken })
                if (isWalletConnected.data.length > 0 && aToken && rToken) {
                    console.log('if')
                    resolve(true);
                } else {
                    console.log('else')
                    resolve(false);
                }
            } catch (error) {
                reject({ error })
            }
        })
    }

    logout(): boolean {
        window.localStorage.removeItem('aToken');
        window.localStorage.removeItem('rToken');

        return true;
    }

    private async generateChallenge(address: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apollo.query({
                query: challengeText,
                variables: {
                    address,
                },
            }).subscribe(async (text) => {
                try {
                    console.log({ et: this.ethereum })
                    const data = text.data as { challenge: { text: string } }
                    resolve({ data: data.challenge.text })
                } catch (error) {
                    reject({ error })
                }
            })
        })
    };

    private async signText(address: string, textChallenge: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const from = address;
                const msg = `0x${Buffer.from(textChallenge, 'utf8').toString('hex')}`;
                const signature = await this.ethereum.request({
                    method: 'personal_sign',
                    params: [msg, from],
                });
                resolve({ data: signature })
            } catch (error) {
                reject({ error })
            }
        })
    }

    private requestLogin(address: string, signature: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.apollo.mutate({
                    mutation: authenticate,
                    variables: {
                        address,
                        signature
                    },
                }).subscribe((authResult) => {
                    resolve(authResult)
                })
            } catch (error) {
                reject({ error })
            }
        })
    }
}
