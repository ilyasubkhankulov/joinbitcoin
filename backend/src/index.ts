import express from "express";
// import livereload from "livereload";
import path from "path";
import { getCoinbaseProStatus } from "./coinbase-pro";
// import { getJiraProject } from "./jira-api"
const app = express();
const port = 8180; // default port to listen

// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname, '.'));

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