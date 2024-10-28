import winston from 'winston';

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),  // Log ke console
  ]
});

const logRequest = (req, res, next) => {
  const { method, url } = req;
  const dateTime = new Date().toISOString();
  logger.info(`[${dateTime}] ${method} request to ${url}`);
  next();  // Lanjutkan ke handler berikutnya
};

export { logger, logRequest };