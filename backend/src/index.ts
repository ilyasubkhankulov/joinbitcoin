import express, { request } from 'express';
import logger from 'pino';
import { PrismaClient } from '.prisma/client';

import { getCoinbaseProStatus } from './coinbase-pro';
import { createInvestor } from './repo';
import Joi from 'joi';

const prisma = new PrismaClient()

const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// define a route handler for the default home page
app.get( '/', ( req, res ) => {
    res.send( 'Hello world!' );
} );

const investorSchema = Joi.object({
    email: Joi.string().email()
  });

app.post( '/sign-up', async ( req, res ) => {
    let value;
    try {
        value = await investorSchema.validateAsync(req.body)
    } catch (err) {
        logger().info(err);
        return res.send({
          status: 'error',
          message: 'Invalid request data',
        });
    }

    const email = req.body.email;
    let investor;
    try {
        investor = await createInvestor(email, { prisma });
        return res.status(201).json({
            status: 'success',
            message: 'Investor created successfully',
            data: {
                'investor_id': investor.id,
                'email': investor.email
            },
            });
    } catch (error) {
        res.send(error);
    }
});

app.get( '/cpro-status', async ( req, res ) => {
    const database = await getCoinbaseProStatus()
    res.send(database);
} );

app.post( '/link-account', async ( req, res ) => {
    // logger().info(request.body);
    const nickname = req.body.nickname;
    const key = req.body.key;
    const secret = req.body.secret;
    const passphrase = req.body.passphrase;
    // createInvestor(email);
    // res.send('good');
} );

// const port = 8180; // default port to listen

// // start the Express server
// const server = app.listen( port, () => {
//     logger().info(`server started at http://localhost:${ port }` );
// } );

export default app;