import { getCoinbaseProStatus } from '../index';

jest.mock('coinbase-pro-node')

import { AccountAPI } from 'coinbase-pro-node';

const returnedAccounts = [
    {
        "id": "71452118-efc7-4cc4-8780-a5e22d4baa53",
        "currency": "BTC",
        "balance": "0.0000000000000000",
        "available": "0.0000000000000000",
        "hold": "0.0000000000000000",
        "profile_id": "75da88c5-05bf-4f54-bc85-5c775bd68254",
        "trading_enabled": true
    },
    {
        "id": "e316cb9a-0808-4fd7-8914-97829c1925de",
        "currency": "USD",
        "balance": "80.2301373066930000",
        "available": "79.2266348066930000",
        "hold": "1.0035025000000000",
        "profile_id": "75da88c5-05bf-4f54-bc85-5c775bd68254",
        "trading_enabled": true
    }
]

describe('Coinbase Link', () => {
    it('Link Account - Production', async () => {
        const key = '';
        const secret = '';
        const passphrase = '';
        const useSandbox = false;

        const status = await getCoinbaseProStatus(
            key,
            secret,
            passphrase,
            useSandbox);

        expect(status).toEqual(true);
    });

    it('Link Account - Sandbox', async () => {
        const key = '';
        const secret = '';
        const passphrase = '';
        const useSandbox = true;

        const status = await getCoinbaseProStatus(
            key,
            secret,
            passphrase,
            useSandbox);

        expect(status).toEqual(true);
    });

    // it('Link Account - Error', async () => {
    //     const key = '';
    //     const secret = '';
    //     const passphrase = '';
    //     const useSandbox = true;

    //     jest.spyOn(AccountAPI.prototype, 'listAccounts').mockImplementation(() => new Promise<any>((resolve) => {
    //         resolve(returnedAccounts);
    //     }));

    //     const status = await getCoinbaseProStatus(
    //         key,
    //         secret,
    //         passphrase,
    //         useSandbox);

    //     expect(status).toEqual(true);
    // });
  });