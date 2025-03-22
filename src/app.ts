import express, {Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import requestLogger from "./middleware/request-logger";
import routes from "./routes/routes";
import {internalServerErrorHandler, notFoundErrorHandler} from "./middleware/error-handler";

/**
 * Configures and returns an Express Application instance.
 *
 * This function sets up middleware for security, compression, CORS, request logging,
 * routing, and error handling.
 *
 * @returns {Application} The configured Express Application instance.
 */
const app: Application = express();

/**
 * Security middleware to set various HTTP headers.
 */
app.use(helmet());

/**
 * Compression middleware to compress response bodies.
 */
app.use(compression());

/**
 * CORS middleware to enable Cross-Origin Resource Sharing.
 */
app.use(cors());

/**
 * Middleware to parse incoming JSON requests.
 */
app.use(express.json());

/**
 * Middleware to parse incoming URL-encoded requests.
 */
app.use(express.urlencoded({extended: true}));

/**
 * Middleware to log incoming HTTP requests.
 */
app.use(requestLogger);

/**
 * Routes middleware to handle application routes.
 */
app.use(routes);

/**
 * Middleware to handle "Not Found" errors (404).
 */
app.use(notFoundErrorHandler);

/**
 * Middleware to handle internal server errors (500).
 */
app.use(internalServerErrorHandler);

/**
 * Exports the configured Express Application instance.
 *
 * This allows the application to be used in the main application entry point.
 */
export default app;