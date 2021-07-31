import express, { request } from 'express';
import logger from 'pino';
import { PrismaClient } from '.prisma/client';

import { getCoinbaseProStatus, saveCoinbaseProCredentials } from './coinbase-pro';
import { createInvestor } from './repo';
import Joi from 'joi';
import cors from 'cors';
import e from 'express';

const prisma = new PrismaClient()

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// define a route handler for the default home page
app.get( '/', ( req, res ) => {
    res.send( 'Hello world!' );
} );

const investorSchema = Joi.object({
    email: Joi.string().email().required()
  });

app.post( '/sign-up', async ( req, res, next ) => {
    try {
        await investorSchema.validateAsync(req.body)
    } catch (err) {
        logger().info(err);
        return res.status(400).send({
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
        res.statusCode = 400;
        return res.send({
            status: 'error',
            message: 'Invalid request data',
          });
    }
});

const coinbaseApiKeySchema = Joi.object({
    nickname: Joi.string().optional(),
    key: Joi.string().required(),
    secret: Joi.string().required(),
    passphrase: Joi.string().required(),
    useSandbox: Joi.boolean().required(),
  });

app.post( '/link-account', async ( req, res, next ) => {
    try {
        await coinbaseApiKeySchema.validateAsync(req.body)
    } catch (err) {
        logger().info(err);
        return res.status(400).send({
          status: 'error',
          message: 'Invalid request data',
        });
    }
    const nickname = req.body.nickname;
    const key = req.body.key;
    const secret = req.body.secret;
    const passphrase = req.body.passphrase;
    const useSandbox = (req.body.useSandbox === 'true');

    // @todo write test to check sandbox boolean
    const successMessage = 'Coinbase Pro account added!';
    try {
        logger().info({'useSandbox': useSandbox});
        const accounts = await getCoinbaseProStatus(key, secret, passphrase, useSandbox);
        const dummyInvestorId = '924a96cc-8af9-41ed-8ce7-12ea32827514';
        // @todo (urgent) check if account exists in the db
        let accountStatus;
        if (accounts.length > 0) {
            accountStatus = true;
        } else {
            throw new Error('No valid trading accounts found')
        }

        await saveCoinbaseProCredentials(
            { prisma },
            accountStatus,
            dummyInvestorId,
            nickname,
            key,
            passphrase,
            secret,
            )
        logger().info(successMessage);
        res.status(201).send({
            status: 'true',
            message: successMessage
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: 'Could not verify Coinbase Pro credentials',
          });
        logger().error(error.toString());
        next(error);
    }
} );

export default app;