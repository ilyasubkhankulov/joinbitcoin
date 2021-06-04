import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4';

const prisma = new PrismaClient()

async function test() {
  // ... you will write your Prisma Client queries here]
  const allInvestors = await prisma.investor.findMany()
  // tslint:disable-next-line:no-console
  console.log(allInvestors)
}

test()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  async function createInvestor(email: string) {
    await prisma.investor.create({
      data: {
        id: uuid(),
        email,
      },
    })

    const allInvestors = await prisma.investor.findMany()
    // tslint:disable-next-line:no-console
    console.dir(allInvestors, { depth: null })
  }

export {
    test,
    createInvestor
}