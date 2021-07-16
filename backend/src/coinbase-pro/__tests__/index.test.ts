import { getCoinbaseProStatus } from '../index';

jest.mock('coinbase-pro-node')

describe('Coinbase Link', () => {
    it('Link Account - Production', async () => {
        const key = '';
        const secret = '';
        const passphrase = '';
        const useSandbox = false;

        const status = getCoinbaseProStatus(
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

        const status = getCoinbaseProStatus(
            key,
            secret,
            passphrase,
            useSandbox);

        expect(status).toEqual(true);
    });
  });