/* Config */
import 'dotenv/config';

/* Express */
import express from 'express';
import { Request, Response, NextFunction } from 'express';

/* Logger */
import winston from 'winston';
import 'winston-daily-rotate-file';
import expressWinston from 'express-winston';
import logger from './helpers/logger';

import helmet from 'helmet';

/* Compression */
import compression from 'compression';

/* Cookie parser */
import cookieParser from 'cookie-parser';

/* TypeORM */
import 'reflect-metadata';
// import { createConnection } from 'typeorm';
// createConnection().catch(err => {
//   logger.error('TypeORM connection error: ', err);
//   process.exit(-1);
// });

/*i18n*/
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

/* Helpers */
import path from 'path';
import createError from 'http-errors';
import { ErrorHandler, handleError } from './helpers/error';

/* SPA History */
import history from 'connect-history-api-fallback';

/* Routes */
import apiRouter from './routes/api';

/* CORS */
import cors from 'cors';

/* User agent */
import useragent from 'express-useragent';

/* Request ip */
import requestIp from 'request-ip';

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/add/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: false,
      lookupQuerystring: 'lng',
      lookupCookie: 'lng',
      lookupHeader: 'accept-language',
    },
    fallbackLng: 'en',
    preload: ['en', 'pl'],
    //load: 'languageOnly',
    saveMissing: true,
    cleanCode: true,
  });

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'dev.debesto.com'],
    },
  })
);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    maxAge: 600,
  })
);

app.use(express.urlencoded({ extended: true, limit: '2000kb' }));
app.use(express.json({ limit: '2000kb' }));

app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;

      return compression.filter(req, res);
    },
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(i18nextMiddleware.handle(i18next));
app.use(requestIp.mw());
app.use(useragent.express());

app.use(
  expressWinston.logger({
    transports: [
      process.env.NODE_ENV === 'development'
        ? new winston.transports.Console()
        : new winston.transports.DailyRotateFile({
            dirname: path.resolve(path.join(__dirname, './logs')),
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '31d',
          }).on('rotate', function (_oldFilename, _newFilename) {
            /* UPLOAD TO CLOUD */
          }),
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    requestField: null,
    responseField: null,
    // requestWhitelist: ['body', 'query'],
    meta: true,
    baseMeta: {},
    dynamicMeta: function (req, _res) {
      return {
        // method: req.method,
        // url: req.url,
        // user: req.user?.id,
        type: req.useragent?.isDesktop ? 'Desktop' : req.useragent?.isMobile ? 'Mobile' : 'Bot',
        browser: req.useragent?.browser,
        // version: req.useragent?.version,
        os: req.useragent?.os,
        platform: req.useragent?.platform,
        ip: req.clientIp,
      };
    },
    msg: 'HTTP {{req.httpVersion}} {{req.method}} {{req.url}} {{res.statusCode}}',
    expressFormat: false,
    colorize: false,
    ignoreRoute: function (_req, _res) {
      return false;
    },
  })
);

// routes
app.use(
  '/api',
  (res, req, next) => {
    next();
  },
  apiRouter
);
const staticFileMiddleware = express.static(path.join(__dirname, 'vue'));
app.use('/', staticFileMiddleware);
app.use(history({ disableDotRule: true, verbose: true }));
app.use(staticFileMiddleware);
app.use('/', (res, req, next) => {
  next();
});

// https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md#configuring-the-middleware

// Catch 404 and forward to error handler
app.use((req, _res, next) => {
  if (!req.route) return next(new createError.NotFound());
  next();
});

// Log errors
app.use(
  (
    /** @type {ErrorHandler} */ err,
    /** @type {Request} */ req,
    /** @type {Response} */ res,
    /** @type {NextFunction} */ _next
  ) => {
    //if (process.env.NODE_ENV === 'development' || err.statusCode == 500) logger.error(err);

    handleError(err, req, res);
  }
);

app.listen(process.env.PORT || 3000, () =>
  logger.info(`App listening on ${process.env.PORT || 3000}!`)
);

process.on('unhandledRejection', error => {
  logger.error('##### unhandledRejection #####\n', error);
});

process.on('uncaughtException', error => {
  logger.error('##### uncaughtException #####\n', error);
});

export default app;
