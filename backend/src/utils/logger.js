const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// Create custom levels with colors
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'gray',
  },
};

// Add colors to winston
winston.addColors(customLevels.colors);

// Define transports
const transports = [
  // Console transport with colors
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    ),
  }),
  // Error file transport
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  // Combined file transport
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Only add console in development
const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: isDevelopment
    ? transports
    : transports.filter((t) => !(t instanceof winston.transports.Console)),
});

module.exports = logger;
