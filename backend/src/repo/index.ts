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
        status: 'Active',
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

/**
 * A function that creates an 'investor' object in the database
 * @param {string} investorId
 * @param {PrismaClient} ctx
 * @return {object}
 */
 async function getValidAccount(
  investorId: string,
  ctx: Context,
) {
  try {
    const account = await ctx.prisma.account.findFirst({
      where: {
        investor_id: investorId,
        status: 'Active',
      },
    });
    return account;
  }
  catch (error) {
    logger().error(error)
    throw new Error(error);
  }
}

/**
 * A function that creates a 'plan' object
 * @param {string} accountId
 * @param {string} frequency
 * @param {string} currency
 * @param {string} amount
 * @param {PrismaClient} ctx
 * @return {object}
 */
 async function createInvestmentPlan(
  accountId: string,
  frequency: string,
  currency: string,
  amount: string,
  ctx: Context,
 ) {
 const investmentPlanId = v4();
 try {
   const planDefinition = {
    frequency,
    currency,
    amount,
   };
   const newInvestmentPlan = await ctx.prisma.plan.create({
     data: {
       id: investmentPlanId,
       account_id: accountId,
       definition: planDefinition,
       status: 'Disabled',
     },
   })
   return newInvestmentPlan;
 }
 catch (err) {
   const errMessage = `Could not save Coinbase Pro credentials: ${err}`
   logger().error(errMessage)
   throw new Error(errMessage);
 }
}


export {
    createInvestor,
    createCoinbaseProAccount,
    getValidAccount,
    createInvestmentPlan,
}