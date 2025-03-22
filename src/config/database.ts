import mongoose from 'mongoose';
import logger from "./logger";

/**
 * Establishes a connection to the MongoDB database.
 *
 * This function retrieves the MongoDB connection URI from the environment variables,
 * validates it, and attempts to connect to the database. It also logs connection status
 * and handles connection errors.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established, or rejects if an error occurs.
 * @throws {Error} If the MONGODB_URI environment variable is not set or if the connection fails.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
      logger.error('MONGODB_URI environment variable is not set. Please set it in your .env file or environment.');
      process.exit(1); // Exit with error code
    }

    logger.info('Connecting to MongoDB...');
    await mongoose.connect(connectionString);

    if (mongoose.connection.host) {
      logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1); // Exit with error code
  }
};

/**
 * Handles the 'disconnected' event of the MongoDB connection.
 *
 * This function logs a message when the MongoDB connection is disconnected.
 */
mongoose.connection.on('disconnected', () => {
  logger.info("MongoDB disconnected");
});

/**
 * Handles the 'error' event of the MongoDB connection.
 *
 * This function logs an error message when a MongoDB connection error occurs.
 */
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error:', err);
});

/**
 * Closes the MongoDB database connection.
 *
 * This function attempts to close the active MongoDB connection and logs the result.
 * It handles potential errors during the closing process.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is closed, or rejects if an error occurs.
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};

/**
 * Handles the SIGINT signal (e.g., Ctrl+C) to gracefully close the MongoDB connection.
 *
 * This function ensures that the MongoDB connection is closed before the application exits.
 * It is registered as a signal handler for the SIGINT signal.
 */
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

/**
 * Exports the active MongoDB connection.
 *
 * This allows other modules to access the established MongoDB connection.
 */
export default mongoose.connection;