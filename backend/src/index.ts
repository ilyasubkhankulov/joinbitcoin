import express from "express";
import { getCoinbaseProStatus } from "./coinbase-pro";
const app = express();
const port = 8180; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get( "/cpro-status", async ( req, res ) => {
    const database = await getCoinbaseProStatus()
    res.send(database);
} );

// start the Express server
app.listen( port, () => {
    // @todo replace with winston
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );