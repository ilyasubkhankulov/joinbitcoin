import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4';
import logger from 'pino';

const prisma = new PrismaClient()

/**
 * A function that returns all 'investor' objects from the database
 * @param {string} email
 * @return {object}
 */
async function test() {
  // ... you will write your Prisma Client queries here]
  const allInvestors = await prisma.investor.findMany()
  // tslint:disable-next-line:no-console
  logger().info(allInvestors)
}

// test()
//   .catch(e => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

/**
 * A function that creates an 'investor' object in the database
 * @param {string} email
 * @return {object}
 */
async function createInvestor(email: string) {
  const newInvestor = await prisma.investor.create({
    data: {
      id: uuid(),
      email,
    },
  })

  // const allInvestors = await prisma.investor.findMany()
  // logger().info(allInvestors, { depth: null })
  return newInvestor;
}

export {
    test,
    createInvestor
}