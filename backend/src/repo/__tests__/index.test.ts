import { account_status, plan_status } from '@prisma/client';
import { MockContext, Context, createMockContext } from '../../context'

import {
  createInvestor,
  createCoinbaseProAccount,
  getValidAccount,
  createInvestmentPlan
} from '../index';

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})

describe('Repository', () => {
    it('Create Investor', async () => {
        const investor = {
            id: '958d07d0-2ec6-4182-9f97-3f671770e55f',
            email: 'hello@prisma.io',
            updated_at: new Date('2019-01-16'),
            created_at: new Date('2019-01-16'),
        }
        mockCtx.prisma.investor.create.mockResolvedValue(investor)

        const investorFromMockedDb = await createInvestor(investor.email, ctx)
        expect(investor).toEqual(investorFromMockedDb);
    });

    it('Create Investor - Error', async () => {
      const investor = {
          id: '958d07d0-2ec6-4182-9f97-3f671770e55f',
          email: 'hello@test.test',
          updated_at: new Date('2019-01-16'),
          created_at: new Date('2019-01-16'),
      }
      mockCtx.prisma.investor.create.mockRejectedValue('db error');

      await expect(createInvestor(investor.email, ctx))
      .rejects
      .toThrow('db error');
    });

    it('Create Account', async () => {
      const account = {
          id: 'f38e36b5-eb6f-4a9d-b455-d54c52b6d376',
          investor_id: '924a96cc-8af9-41ed-8ce7-12ea32827514',
          status: account_status.Active,
          exchange: 'coinbasepro',
          updated_at: new Date('2019-01-16'),
          created_at: new Date('2019-01-16'),
      }
      mockCtx.prisma.account.create.mockResolvedValue(account)

      const mockCoinbaseProCredentials = {
        nickname: '123',
        key: 'xsqiemh9r2',
        passphrase: 'xtr9mdcv42',
        secret: 'm24r30oova',
      }

      const investorFromMockedDb = await createCoinbaseProAccount(
        account.investor_id,
        mockCoinbaseProCredentials.nickname,
        mockCoinbaseProCredentials.key,
        mockCoinbaseProCredentials.passphrase,
        mockCoinbaseProCredentials.secret,
        ctx
      )
      expect(account).toEqual(investorFromMockedDb);
    });

    it('Create Account - Error', async () => {
      const account = {
          id: 'f38e36b5-eb6f-4a9d-b455-d54c52b6d376',
          investor_id: '924a96cc-8af9-41ed-8ce7-12ea32827514',
          exchange: 'coinbasepro',
          updated_at: new Date('2019-01-16'),
          created_at: new Date('2019-01-16'),
      }
      mockCtx.prisma.account.create.mockRejectedValue('db error');

      const mockCoinbaseProCredentials = {
        nickname: '123',
        key: 'xsqiemh9r2',
        passphrase: 'xtr9mdcv42',
        secret: 'm24r30oova',
      }

      await expect(createCoinbaseProAccount(
        account.investor_id,
        mockCoinbaseProCredentials.nickname,
        mockCoinbaseProCredentials.key,
        mockCoinbaseProCredentials.passphrase,
        mockCoinbaseProCredentials.secret,
        ctx
      )).rejects
      .toThrow('db error');
    });

    it('Get Valid Account - Success', async () => {
      const account = {
        'id': 'f1c2c703-e21b-43f1-ad74-fbcbe85aab7a',
        'investor_id': '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab',
        'status': account_status.Active,
        'exchange': 'coinbasepro',
        'updated_at': new Date('2021-09-02 03:08:20.698-07'),
        'created_at': new Date('2021-09-02 03:08:20.698-07')
      };

      mockCtx.prisma.account.findFirst.mockResolvedValue(account)

      const accountFromMockedDb = await getValidAccount(account.investor_id, ctx)
      expect(account).toEqual(accountFromMockedDb);
    });

    it('Get Valid Account - Error', async () => {
      const account = {
        'id': 'f1c2c703-e21b-43f1-ad74-fbcbe85aab7a',
        'investor_id': '8fcc0e76-f9ee-47f6-9fb1-a11e44b75cab',
        'status': account_status.Active,
        'exchange': 'coinbasepro',
        'updated_at': new Date('2021-09-02 03:08:20.698-07'),
        'created_at': new Date('2021-09-02 03:08:20.698-07')
      };

      mockCtx.prisma.account.findFirst.mockRejectedValue('db error');

      await expect(getValidAccount(
        account.investor_id, ctx
      )).rejects
      .toThrow('db error');
    });

    it('Create Investment Plan - Success', async () => {
      const plan = {
        'id': '79655efa-ba4c-4a8e-9b00-2b839a86a8b6',
        'account_id': 'f1c2c703-e21b-43f1-ad74-fbcbe85aab7a',
        'status': plan_status.Disabled,
        'definition': {
          'amount': '10',
          'currency': 'USD',
          'frequency': 'week'
        },
        'updated_at': new Date('2021-09-02 03:08:20.698-07'),
        'created_at': new Date('2021-09-02 03:08:20.698-07')
      }
      mockCtx.prisma.plan.create.mockResolvedValue(plan)

      const mockPlan = {
        frequency: 'week',
        currency: 'USD',
        amount: '10'
      }

      const planFromMockedDb = await createInvestmentPlan(
        plan.account_id,
        mockPlan.frequency,
        mockPlan.currency,
        mockPlan.amount,
        ctx
      )
      expect(plan).toEqual(planFromMockedDb);
    });

    it('Create Investment Plan - Error', async () => {
      const plan = {
        'id': '79655efa-ba4c-4a8e-9b00-2b839a86a8b6',
        'account_id': 'f1c2c703-e21b-43f1-ad74-fbcbe85aab7a',
        'status': plan_status.Disabled,
        'definition': {
          'amount': '10',
          'currency': 'USD',
          'frequency': 'week'
        },
        'updated_at': new Date('2021-09-02 03:08:20.698-07'),
        'created_at': new Date('2021-09-02 03:08:20.698-07')
      }
      mockCtx.prisma.plan.create.mockRejectedValue('db error');

      const mockPlan = {
        frequency: 'week',
        currency: 'USD',
        amount: '10'
      }

      await expect(createInvestmentPlan(
        plan.account_id,
        mockPlan.frequency,
        mockPlan.currency,
        mockPlan.amount,
        ctx
      )).rejects
      .toThrow('db error');
    });
  });