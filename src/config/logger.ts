import winston from 'winston';

/**
 * Configures and creates a Winston logger instance.
 *
 * This logger supports multiple transports (console, error file, and combined file)
 * and uses structured JSON logging with timestamps and error stack traces.
 * The log level is configurable via the LOG_LEVEL environment variable.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({stack: true}),
      winston.format.json()
  ),
  defaultMeta: {service: 'todo-app'},
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
      ),
    }),
  ],
});

/**
 * Exports the configured Winston logger instance.
 *
 * This allows other modules to use the logger for logging messages.
 */
export default logger;