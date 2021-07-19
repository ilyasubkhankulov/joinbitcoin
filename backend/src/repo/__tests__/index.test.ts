import { MockContext, Context, createMockContext } from '../../context'

import { createInvestor, createCoinbaseProAccount } from '../index';

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
  });