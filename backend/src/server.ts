import app from "./index"
import logger from 'pino';

const port = 8180; // default port to listen

// start the Express server
app.listen( port, () => {
    logger().info(`server started at http://localhost:${ port }` );
} );