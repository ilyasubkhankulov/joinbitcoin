import express, { request } from "express";
import { getCoinbaseProStatus } from "./coinbase-pro";
import bodyParser from "body-parser";

import { createInvestor } from "./repo";

import logger from 'pino';

const app = express();
const port = 8180; // default port to listen

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.post( "/sign-up", async ( req, res ) => {
    logger().info(req.body)
    const email = req.body.email;
    const investor = await createInvestor(email);
    logger().info(investor);
    res.send({"investor_id": investor.id});
} );

app.get( "/cpro-status", async ( req, res ) => {
    const database = await getCoinbaseProStatus()
    res.send(database);
} );

app.post( "/link-account", async ( req, res ) => {
    logger().info(request.body);
    const nickname = req.body.nickname;
    const key = req.body.key;
    const secret = req.body.secret;
    const passphrase = req.body.passphrase;
    // createInvestor(email);
    // res.send('good');
} );

// start the Express server
app.listen( port, () => {
    logger().info(`server started at http://localhost:${ port }` );
} );