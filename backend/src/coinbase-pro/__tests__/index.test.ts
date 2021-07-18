import { getCoinbaseProStatus } from '../index';

jest.mock('coinbase-pro-node')

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