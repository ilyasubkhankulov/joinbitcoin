import express from "express";
// import { getNotionDb } from "./notion-api";
// import { getJiraProject } from "./jira-api"
const app = express();
const port = 8180; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// app.get( "/notion-db/:id", async ( req, res ) => {
//     const database = await getNotionDb(req.params.id)
//     res.send(database);
// } );

// app.get( "/jira-api/project", async ( req, res ) => {
//     const jiraProject = await getJiraProjects()
//     res.send(jiraProject);
// } );

// start the Express server
app.listen( port, () => {
    // @todo replace with winston
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );