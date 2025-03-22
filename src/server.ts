import './config/env';
import {connectDB} from './config/database';
import app from './app';
import logger from './config/logger';

/**
 * The port on which the server will listen.
 * Defaults to 3000 if the PORT environment variable is not set.
 */
const PORT = process.env.PORT ?? 3000;

/**
 * Starts the server after successfully connecting to the database.
 *
 * This function connects to the MongoDB database and then starts the Express
 * application, logging the server's running status. If the database connection
 * fails, it logs an error and exits the process.
 */
connectDB()
.then(() => {
  app.listen(PORT, () => {
    logger.info(`Running in ${process.env.NODE_ENV} mode`);
    logger.info(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  logger.error('Failed to connect to MongoDB', error);
  process.exit(1); // Exit with error code
});