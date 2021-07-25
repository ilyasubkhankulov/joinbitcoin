import app from '../index';
import request from 'supertest';

import { Account } from 'coinbase-pro-node';

jest.mock('uuid');
jest.mock('../repo');
jest.mock('../coinbase-pro');

import uuid from 'uuid';
import { createInvestor } from '../repo';
import { getCoinbaseProStatus } from '../coinbase-pro';

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
];

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(null), 400)); // avoid jest open handle error https://github.com/visionmedia/supertest/issues/520#issuecomment-469044925
});

beforeAll(async () => {
  jest.mock('coinbase-pro-node')
})

describe('GET / - a simple test of the root api endpoint', () => {
  it('Hello API Request', async () => {
    const result = await request(app).get('/');
    expect(result.text).toEqual('Hello world!');
    expect(result.statusCode).toEqual(200);
  });
});

describe('POST /sign-up - test sign up endpoint with mocked database function', () => {
  it('Sign-up API Request - Returns 201 (success)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValue('fake unused uuid');

    (createInvestor as jest.Mock).mockReturnValue(Promise.resolve(investor));

    const result = await request(app).post('/sign-up').send({'email': investor.email}).expect(201);
    expect(result.body.data.investor_id).toBeDefined();
    expect(result.body.data.investor_id).toBe(investor.id);
    expect(result.body.data.email).toBe(investor.email);
  });

  it('Sign-up API Request - Returns 400 (missing email)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValue('fake unused uuid');

    (createInvestor as jest.Mock).mockReturnValue(Promise.resolve(investor));

    const result = await request(app).post('/sign-up').send().expect(400);
  });

  it('Sign-up API Request - Returns 400 (email key spelled incorrectly)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValue('fake unused uuid');

    (createInvestor as jest.Mock).mockReturnValue(Promise.resolve(investor));

    const result = await request(app).post('/sign-up').send({'e-mail': investor.email}).expect(400);

  });

  it('Sign-up API Request - Returns 400 (email formated incorrectly)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValue('fake unused uuid');

    (createInvestor as jest.Mock).mockReturnValue(Promise.resolve(investor));

    const result = await request(app).post('/sign-up').send({'email': 'hello@xyz'}).expect(400);

    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.status).toBe('error');
    expect(result.body.message).toBe('Invalid request data');
  });

  it('Sign-up API Request - Returns 400 (email already exists in the database)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValue('fake unused uuid');

    (createInvestor as jest.Mock).mockRejectedValue(Promise.resolve(new Error()));

    const result = await request(app).post('/sign-up').send({'email': investor.email}).expect(400);

    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.status).toBe('error');
    expect(result.body.message).toBe('Invalid request data');
  });
});

describe('POST /link-account - test link account endpoint with mocked database function', () => {
  it('Link API Request - Returns 201 (success)', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      useSandbox: false,
    };

    const mockResponseGetCoinbaseProStatus = returnedAccounts;

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({
      status: 'true',
      message: 'Coinbase Pro account active!'
    });
  });

  it('Link API Request - Returns 201 (success) - use sandbox', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      useSandbox: true,
    };

    const mockResponseGetCoinbaseProStatus = returnedAccounts;

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({
      status: 'true',
      message: 'Coinbase Pro account active!'
    });
  });

  it('Link API Request - Returns 201 (success) - use prod', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      useSandbox: false,
    };

    const mockResponseGetCoinbaseProStatus = returnedAccounts;

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({
      status: 'true',
      message: 'Coinbase Pro account active!'
    });
  });

  it('Link API Request - Returns 400 (failed) - use prod', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      useSandbox: false,
    };

    // const mockResponseGetCoinbaseProStatus = Account[];
    const mockResponseGetCoinbaseProStatus = <Account[]>[];

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    expect({
      status: 'error',
      message: 'Invalid Coinbase Pro API credentials',
    })
  });

  it('Link API Request - Throws Error (invalid credentials)', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      useSandbox: '',
    };

    const mockResponseGetCoinbaseProStatus = new Error();

    (getCoinbaseProStatus as jest.Mock).mockRejectedValue(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    expect({
      status: 'error',
      message: 'Invalid Coinbase Pro API credentials',
    })
  });
});