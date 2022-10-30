import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ethers, utils, Wallet } from 'ethers';
import { authenticate, challengeText } from '../queries/user.query';
import { Buffer } from 'buffer';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    readonly NO_INSTALLED_WALLET = 'no_installed_wallet';
    readonly GENERAL_ERROR = 'general_error';
    readonly EMPTY_ACCOUNT = 'empty_account';
    public ethereum;
    constructor(private apollo: Apollo) {
        const { ethereum } = <any>window
        this.ethereum = ethereum
    }

    async connect(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.ethereum) {
                    reject({ error: this.NO_INSTALLED_WALLET })
                } else {
                    const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
                    resolve({ data: accounts })
                }
            }
            catch (exc: any) {
                if (exc.hasOwnProperty('message')) {
                    reject({ error: exc.message })
                } else {
                    reject({ error: this.GENERAL_ERROR })
                }
            }
        })
    }

    async isConnected(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.ethereum) {
                    reject({ error: this.NO_INSTALLED_WALLET })
                } else {
                    const accounts = await this.ethereum.request({ method: 'eth_accounts' });
                    console.log({ accounts })
                    if (accounts.length > 0) {
                        resolve({ data: accounts })
                    } else {
                        reject({ data: this.EMPTY_ACCOUNT })
                    }
                }
            }
            catch (exc: any) {
                if (exc.hasOwnProperty('message')) {
                    reject({ error: exc.message })
                } else {
                    reject({ error: this.GENERAL_ERROR })
                }
            }
        })
    }
}
