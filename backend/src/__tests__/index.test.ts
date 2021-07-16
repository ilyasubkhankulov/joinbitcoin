import app from '../index';
import request from 'supertest';
// import logger from 'pino';

jest.mock('uuid');
jest.mock('../repo');
jest.mock('../coinbase-pro');

import uuid from 'uuid';
import { createInvestor } from '../repo';
import { getCoinbaseProStatus } from '../coinbase-pro';

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

describe('POST /link-account - test sign up endpoint with mocked database function', () => {
  it('Link API Request - Returns 201 (success)', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      use_sandbox: '',
    };

    const mockResponseGetCoinbaseProStatus = true;

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    const result = await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({ status: 'true' });
  });

  it('Link API Request - Returns 201 (success) - use sandbox', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      use_sandbox: true,
    };

    const mockResponseGetCoinbaseProStatus = true;

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    const result = await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({ status: 'true' });
  });

  it('Link API Request - Returns 201 (success) - use prod', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      use_sandbox: false,
    };

    const mockResponseGetCoinbaseProStatus = true;

    (getCoinbaseProStatus as jest.Mock).mockReturnValue(mockResponseGetCoinbaseProStatus);

    const result = await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({ status: 'true' });
  });


  it('Link API Request - Throws Error (invalid credentials)', async () => {
    const coinbaseProAccount = {
      nickname: '',
      key: '',
      secret: '',
      passphrase: '',
      use_sandbox: '',
    };

    const mockResponseGetCoinbaseProStatus = new Error();
    
    (getCoinbaseProStatus as jest.Mock).mockRejectedValue(mockResponseGetCoinbaseProStatus);

    const result = await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    expect({
      status: 'error',
      message: 'Invalid Coinbase Pro API credentials',
    })
  });
});