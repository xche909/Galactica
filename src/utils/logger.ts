import winston from 'winston';
import newrelic from 'newrelic';

const logger = winston.createLogger({
  level: 'debug', // lowest level to log; change to 'info' or 'warn' in prod
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

// Helper for each log level + optional New Relic custom event recording
export const logInfo = (message: string, metadata?: object) => {
  logger.info(message, metadata);
  newrelic.recordCustomEvent('LogInfo', { message, ...metadata });
};

export const logWarn = (message: string, metadata?: object) => {
  logger.warn(message, metadata);
  newrelic.recordCustomEvent('LogWarn', { message, ...metadata });
};

export const logDebug = (message: string, metadata?: object) => {
  logger.debug(message, metadata);
  newrelic.recordCustomEvent('LogDebug', { message, ...metadata });
};

export const logError = (message: string, metadata?: object) => {
  logger.error(message, metadata);
  newrelic.recordCustomEvent('LogError', { message, ...metadata });
};

export const logVerbose = (message: string, metadata?: object) => {
  logger.verbose(message, metadata);
  newrelic.recordCustomEvent('LogVerbose', { message, ...metadata });
};

export const logHttp = (message: string, metadata?: object) => {
  logger.http(message, metadata);
  newrelic.recordCustomEvent('LogHTTP', { message, ...metadata });
};

export default logger;
