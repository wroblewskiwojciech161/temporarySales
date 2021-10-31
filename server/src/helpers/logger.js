import path from 'path';

/* Logger */
import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, prettyPrint } = winston.format;

const logger = winston.createLogger({
  exitOnError: false,
  handleExceptions: true,
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'warn',
      handleRejections: true,
      dirname: path.resolve(path.join(__dirname, '../logs')),
      filename: '%DATE%.err',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '14d',
    }).on('rotate', function (_oldFilename, _newFilename) {
      /* UPLOAD TO CLOUD */
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp(), prettyPrint()),
    })
  );
}

export default logger;
