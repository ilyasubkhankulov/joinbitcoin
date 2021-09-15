import app from '../index';
import request from 'supertest';

import { Account } from 'coinbase-pro-node';

jest.mock('uuid');
jest.mock('../repo');
jest.mock('../coinbase-pro');

import uuid from 'uuid';
import { createInvestmentPlan, createInvestor } from '../repo';
import { getCoinbaseProStatus, saveCoinbaseProCredentials, verifyValidAccountExists } from '../coinbase-pro';
import { JestMockExtended } from 'jest-mock-extended';

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

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(null), 400)); // avoid jest open handle error https://github.com/visionmedia/supertest/issues/520#issuecomment-469044925
});

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
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('fake unused uuid');

    (createInvestor as jest.Mock).mockReturnValueOnce(Promise.resolve(investor));

    const body = {'email': investor.email};

    const result = await request(app).post('/sign-up').send(body).expect(201);
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
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('fake unused uuid');

    await request(app).post('/sign-up').send().expect(400);
  });

  it('Sign-up API Request - Returns 400 (email key spelled incorrectly)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('fake unused uuid');

    const body = {'e-mail': investor.email};

    await request(app).post('/sign-up').send(body).expect(400);

  });

  it('Sign-up API Request - Returns 400 (email formated incorrectly)', async () => {
    const investor = {
      id: '9f64d611-b1cb-461f-941a-3fb83c57f335',
      email: 'hello@xyz.xyz',
      updated_at: new Date('2019-01-16'),
      created_at: new Date('2019-01-16'),
    }
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('fake unused uuid');

    const body = {'email': 'hello@xyz'}

    const result = await request(app).post('/sign-up').send().expect(400);

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
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('fake unused uuid');

    (createInvestor as jest.Mock).mockRejectedValueOnce(Promise.resolve(new Error()));

    const body = {'email': investor.email};

    const result = await request(app).post('/sign-up').send(body).expect(400);

    expect(result.body.status).toBeDefined();
    expect(result.body.message).toBeDefined();
    expect(result.body.status).toBe('error');
    expect(result.body.message).toBe('Invalid Coinbase Pro API credentials');
  });
});

describe('POST /link-account - test link account endpoint with mocked database function', () => {
  it('Link API Request - Returns 201 (success)', async () => {
    const coinbaseProAccount = {
      nickname: 'asda',
      key: 'asda',
      secret: 'asdasd',
      passphrase: 'asdas',
      useSandbox: false,
    };

    const mockResponseGetCoinbaseProStatus = returnedAccounts;
    (getCoinbaseProStatus as jest.Mock).mockReturnValueOnce(mockResponseGetCoinbaseProStatus);

    (saveCoinbaseProCredentials as jest.Mock).mockReturnValueOnce(true);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({
      status: 'true',
      message: 'Coinbase Pro account added!'
    });
  });

  it('Link API Request - Returns 201 (success) - use sandbox', async () => {
    const coinbaseProAccount = {
      nickname: 'asda',
      key: 'asda',
      secret: 'asdas',
      passphrase: 'asdas',
      useSandbox: true,
    };

    const mockResponseGetCoinbaseProStatus = returnedAccounts;

    (getCoinbaseProStatus as jest.Mock).mockReturnValueOnce(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({
      status: 'true',
      message: 'Coinbase Pro account added!'
    });
  });

  it('Link API Request - Returns 201 (success) - use prod', async () => {
    const coinbaseProAccount = {
      nickname: 'asdas',
      key: 'asd',
      secret: 'asd',
      passphrase: 'asd',
      useSandbox: false,
    };

    const mockResponseGetCoinbaseProStatus = returnedAccounts;

    (getCoinbaseProStatus as jest.Mock).mockReturnValueOnce(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(201)
    .expect({
      status: 'true',
      message: 'Coinbase Pro account added!'
    });
  });

  it('Link API Request - Returns 400 (failed) - use prod', async () => {
    const coinbaseProAccount = {
      nickname: 'asdas',
      key: 'asdasd',
      secret: 'asdasd',
      passphrase: 'asdas',
      useSandbox: false,
    };

    const mockResponseGetCoinbaseProStatus = [] as Account[];

    (getCoinbaseProStatus as jest.Mock).mockReturnValueOnce(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'Could not verify Coinbase Pro credentials',
    })
  });

  it('Link API Request - Throws Error (invalid credentials)', async () => {
    const coinbaseProAccount = {
      nickname: 'asd',
      key: 'asdas',
      secret: 'qwe1awd',
      passphrase: 'asdasd',
      useSandbox: true,
    };

    const mockResponseGetCoinbaseProStatus = new Error();

    (getCoinbaseProStatus as jest.Mock).mockRejectedValueOnce(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'Could not verify Coinbase Pro credentials',
    })
  });

  it('Link API Request - Throws Error (request schema invalid)', async () => {
    const coinbaseProAccount = {
      nickname: 'asd',
      key: 'asdas',
      secret: 'qwe1awd',
      // missing passphrase
      useSandbox: true,
    };

    const mockResponseGetCoinbaseProStatus = new Error();

    (getCoinbaseProStatus as jest.Mock).mockRejectedValueOnce(mockResponseGetCoinbaseProStatus);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'Invalid request data',
    })
  });

  it('Link API Request - Could not save credentials to the db', async () => {
    const coinbaseProAccount = {
      nickname: 'aasd',
      key: 'asd',
      secret: 'asdas',
      passphrase: 'asda',
      useSandbox: 'true',
    };

    (getCoinbaseProStatus as jest.Mock).mockResolvedValueOnce(returnedAccounts);
      (saveCoinbaseProCredentials as jest.Mock).mockRejectedValueOnce(false);

    await request(app).post('/link-account').send(coinbaseProAccount).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'Could not verify Coinbase Pro credentials',
    })
  });
});

describe('POST /create-plan - ...', () => {
  it('Create Plan API Request - Returns 201 (success)', async () => {
    const investmentPlan = {
      currency: 'USD',
      amount: '10',
      frequency: 'week',
    };

    const mockedAccountId = '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab';
    const mockedPlan = {
      investor_id: '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab',
      id: '79655efa-ba4c-4a8e-9b00-2b839a86a8b6',
    };

    (verifyValidAccountExists as jest.Mock).mockResolvedValueOnce(mockedAccountId);
    (createInvestmentPlan as jest.Mock).mockReturnValueOnce(Promise.resolve(mockedPlan));

    await request(app).post('/create-plan').send(investmentPlan).expect(201)
    .expect({
      'status': 'success',
      'message': 'Investor created successfully',
      'data': {
          'investor_id': mockedPlan.investor_id,
          'plan_id': mockedPlan.id,
      }
    });
  });

  it('Create Investment Plan Request - Throws Error (request schema invalid)', async () => {
    const investmentPlan = {
      currency: 'USD',
      amount: '10',
      // missing frequency
    };

    await request(app).post('/create-plan').send(investmentPlan).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'Invalid investment plan definition',
    })
  });

  it('Create Investment Plan Request - Throws Error (invalid account)', async () => {
    const investmentPlan = {
      currency: 'USD',
      amount: '10',
      frequency: 'week',
    };

    const mockedAccountId = '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab';
    const mockedPlan = {
      investor_id: '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab',
      id: '79655efa-ba4c-4a8e-9b00-2b839a86a8b6',
    };

    (verifyValidAccountExists as jest.Mock).mockRejectedValueOnce(Promise.resolve(new Error('Error saving database credentials.')))
    // (createInvestmentPlan as jest.Mock).mockReturnValueOnce(Promise.resolve(mockedPlan));

    await request(app).post('/create-plan').send(investmentPlan).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'No valid trading account exists',
    })
  });

  it('Create Investment Plan Request - Throws Error (failed to create plan in db)', async () => {
    const investmentPlan = {
      currency: 'USD',
      amount: '10',
      frequency: 'week',
    };

    const mockedAccountId = '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab';
    const mockedPlan = {
      investor_id: '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab',
      id: '79655efa-ba4c-4a8e-9b00-2b839a86a8b6',
    };

    (verifyValidAccountExists as jest.Mock).mockResolvedValueOnce(mockedAccountId);
    (createInvestmentPlan as jest.Mock).mockRejectedValueOnce(Promise.resolve(new Error('Could not create investment plan')))

    await request(app).post('/create-plan').send(investmentPlan).expect(400)
    .expect('Content-Type', /json/)
    .expect({
      status: 'error',
      message: 'Could not create investment plan',
    })
  });
});