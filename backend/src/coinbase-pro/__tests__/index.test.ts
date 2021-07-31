import { MockContext, Context, createMockContext } from '../../context'
import { getCoinbaseProStatus, saveCoinbaseProCredentials } from '../index';
import { createCoinbaseProAccount } from '../../repo';

jest.mock('../../repo');

const mockListAccounts = jest.fn();

let mockCtx: MockContext
let ctx: Context

const returnedAccounts = [
    {
        'id': '71452118-efc7-4cc4-8780-a5e22d4baa53',
        'currency': 'BTC',
        'balance': '0.0000000000000000',
        'available': '0.0000000000000000',
        'hold': '0.0000000000000000',
        'profile_id': '75da88c5-05bf-4f54-bc85-5c775bd68254',
        'trading_enabled': true
    },
    {
        'id': 'e316cb9a-0808-4fd7-8914-97829c1925de',
        'currency': 'USD',
        'balance': '80.2301373066930000',
        'available': '79.2266348066930000',
        'hold': '1.0035025000000000',
        'profile_id': '75da88c5-05bf-4f54-bc85-5c775bd68254',
        'trading_enabled': true
    }
];

jest.mock('coinbase-pro-node', () => {
    return {CoinbasePro: function() { // tslint:disable-line
      return {rest: {
        account: {listAccounts: mockListAccounts}}}
    }}});

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

describe('Coinbase Link', () => {


    it('Link Account - Production', async () => {
        const key = '';
        const secret = '';
        const passphrase = '';
        const useSandbox = false;

        mockListAccounts.mockImplementationOnce(()=>
            new Promise(resolve => resolve(returnedAccounts))
        );

        const status = await getCoinbaseProStatus(
            key,
            secret,
            passphrase,
            useSandbox);

        expect(status).toEqual(returnedAccounts);
    });

    it('Link Account - Sandbox', async () => {
        const key = '';
        const secret = '';
        const passphrase = '';
        const useSandbox = true;

        mockListAccounts.mockImplementationOnce(()=>
            new Promise(resolve => resolve(returnedAccounts))
        );

        const status = await getCoinbaseProStatus(
            key,
            secret,
            passphrase,
            useSandbox);

        expect(status).toEqual(returnedAccounts);
    });

    it('Save Coinbase Pro Credentials - Valid Account', async () => {
        const accountStatus = true;
        const investorId = '924a96cc-8af9-41ed-8ce7-12ea32827514';
        const nickname = 'nickname';
        const key = 'owo050jiki';
        const secret = 'bnl1g362ii';
        const passphrase = 'qmbo73f8b5';

        (createCoinbaseProAccount as jest.Mock).mockReturnValueOnce(Promise.resolve({
            'id': 'asdad',
        }));

        const status = await saveCoinbaseProCredentials(
            ctx,
            accountStatus,
            investorId,
            nickname,
            key,
            secret,
            passphrase
        );

        expect(status).toEqual(true);
    });

    it('Save Coinbase Pro Credentials - Error saving to db', async () => {
        const accountStatus = true;
        const investorId = '924a96cc-8af9-41ed-8ce7-12ea32827514';
        const nickname = 'nickname';
        const key = 'owo050jiki';
        const secret = 'bnl1g362ii';
        const passphrase = 'qmbo73f8b5';

        (createCoinbaseProAccount as jest.Mock).mockRejectedValueOnce('Error saving database credentials.');

        await expect(saveCoinbaseProCredentials(
            ctx,
            accountStatus,
            investorId,
            nickname,
            key,
            secret,
            passphrase
        )).rejects
        .toThrow('Error saving database credentials.');
    });

    it('Save Coinbase Pro Credentials - Error saving credentials', async () => {
        const accountStatus = false;
        const investorId = '924a96cc-8af9-41ed-8ce7-12ea32827514';
        const nickname = 'nickname';
        const key = 'owo050jiki';
        const secret = 'bnl1g362ii';
        const passphrase = 'qmbo73f8b5';

        await expect(saveCoinbaseProCredentials(
            ctx,
            accountStatus,
            investorId,
            nickname,
            key,
            secret,
            passphrase
        )).rejects
        .toThrow('Coinbase API Account is not active.');
    });

    it('Link Account - Invalid credentials', async () => {
        const key = '';
        const secret = '';
        const passphrase = '';
        const useSandbox = true;

        mockListAccounts.mockImplementationOnce(()=> new Promise((resolve, reject) => {
            reject(new Error('reject 1'));
        })
        );

        await expect(getCoinbaseProStatus(
            key,
            secret,
            passphrase,
            useSandbox)).rejects.toThrow('Invalid Coinbase Pro Account')
    });

  });