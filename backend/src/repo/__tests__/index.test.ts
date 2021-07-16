import { MockContext, Context, createMockContext } from '../../context'

import { createInvestor } from '../index';

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
          email: 'hello@prisma.io',
          updated_at: new Date('2019-01-16'),
          created_at: new Date('2019-01-16'),
      }
      mockCtx.prisma.investor.create.mockRejectedValue('db error');

      await expect(createInvestor(investor.email, ctx))
      .rejects
      .toThrow('db error');
    });
  });