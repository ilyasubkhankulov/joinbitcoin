import { PrismaClient } from '@prisma/client'

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

  // async function createUser() {
  //   await prisma.investor.create({
  //     data: {
  //       email: 'test@test.xyzabc'
  //     },
  //   })

    // const allInvestors = await prisma.investor.findMany()
    // console.dir(allInvestors, { depth: null })
  // }

export {
    test
}