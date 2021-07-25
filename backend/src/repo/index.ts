import { Context } from '../context'
import { v4 } from 'uuid';
import logger from 'pino';

/**
 * A function that creates an 'investor' object in the database
 * @param {string} email
 * @param {PrismaClient} ctx
 * @return {object}
 */
async function createInvestor(
    email: string,
    ctx: Context,
  ) {
  // @todo check if investor exists first and exit before hitting the database
  try {
    const newInvestor = await ctx.prisma.investor.create({
      data: {
        id: v4(),
        email,
      },
    })
    return newInvestor;
  }
  catch (error) {
    logger().error(error)
    throw new Error(error);
  }
}

/**
 * A function that creates an 'account' object and 'exchange_coinbase' in the database
 * @param {string} email
 * @param {PrismaClient} ctx
 * @return {object}
 */
 async function createCoinbaseProAccount(
   investorId: string,
   nickname: string,
   key: string,
   passphrase: string,
   secret: string,
   ctx: Context,
  ) {
  // @todo check if account exists first (via MD5 hash) and exit before hitting the database
  const exchange = 'coinbasepro';
  const accountId = v4();
  try {
    const newCoinbaseProAccount = await ctx.prisma.account.create({
      data: {
        id: accountId,
        investor_id: investorId,
        exchange,
        exchange_coinbasepro: {
          create: [
            {
              id: v4(),
              nickname,
              key,
              passphrase,
              secret,
            },
          ],
        },
      },
    })
    return newCoinbaseProAccount;
  }
  catch (err) {
    const errMessage = `Could not save Coinbase Pro credentials: ${err}`
    logger().error(errMessage)
    throw new Error(errMessage);
  }
}

export {
    createInvestor,
    createCoinbaseProAccount
}