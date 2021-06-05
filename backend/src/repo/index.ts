import { Context } from '../context'
import { v4 } from 'uuid';
import logger from 'pino';

/**
 * A function that returns all 'investor' objects from the database
 * @param {string} email
 * @return {object}
 */
async function test(ctx: Context) {
  // ... you will write your Prisma Client queries here]
  const allInvestors = await ctx.prisma.investor.findMany()
  // logger().info(allInvestors)
}

/**
 * A function that creates an 'investor' object in the database
 * @param {string} email
 * @param {PrismaClient} ctx
 * @return {object}
 */
async function createInvestor(email: string, ctx: Context) {
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

export {
    test,
    createInvestor
}