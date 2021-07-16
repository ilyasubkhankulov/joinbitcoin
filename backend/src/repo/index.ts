import { Context } from '../context'
import { v4 } from 'uuid';
import logger from 'pino';

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
    createInvestor
}