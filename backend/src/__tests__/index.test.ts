import app from '../index';
import request from 'supertest';
import logger from 'pino';

jest.mock('uuid');
jest.mock('../repo');

import uuid from 'uuid';
import { createInvestor } from '../repo';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(null), 500)); // avoid jest open handle error https://github.com/visionmedia/supertest/issues/520#issuecomment-469044925
});

describe('GET / - a simple test of the root api endpoint', () => {
  it('Hello API Request', async () => {
    const result = await request(app).get('/');
    expect(result.text).toEqual('Hello world!');
    expect(result.statusCode).toEqual(200);
  });
});

describe('POST /sign-up - test sign up endpoint with mocked database function', () => {
  it('Sign-up API Request', async () => {
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
});