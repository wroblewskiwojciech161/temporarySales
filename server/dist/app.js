"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _winston = _interopRequireDefault(require("winston"));

require("winston-daily-rotate-file");

var _expressWinston = _interopRequireDefault(require("express-winston"));

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _helmet = _interopRequireDefault(require("helmet"));

var _compression = _interopRequireDefault(require("compression"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

require("reflect-metadata");

var _i18next = _interopRequireDefault(require("i18next"));

var _i18nextFsBackend = _interopRequireDefault(require("i18next-fs-backend"));

var _i18nextHttpMiddleware = _interopRequireDefault(require("i18next-http-middleware"));

var _path = _interopRequireDefault(require("path"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _error = require("./helpers/error");

var _connectHistoryApiFallback = _interopRequireDefault(require("connect-history-api-fallback"));

var _api = _interopRequireDefault(require("./routes/api"));

var _cors = _interopRequireDefault(require("cors"));

var _expressUseragent = _interopRequireDefault(require("express-useragent"));

var _requestIp = _interopRequireDefault(require("request-ip"));

/* Config */

/* Express */

/* Logger */

/* Compression */

/* Cookie parser */

/* TypeORM */
// import { createConnection } from 'typeorm';
// createConnection().catch(err => {
//   logger.error('TypeORM connection error: ', err);
//   process.exit(-1);
// });

/*i18n*/

/* Helpers */

/* SPA History */

/* Routes */

/* CORS */

/* User agent */

/* Request ip */
_i18next.default.use(_i18nextFsBackend.default).use(_i18nextHttpMiddleware.default.LanguageDetector).init({
  backend: {
    loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
    addPath: __dirname + '/locales/add/{{lng}}/{{ns}}.json'
  },
  detection: {
    order: ['querystring', 'cookie', 'header'],
    caches: false,
    lookupQuerystring: 'lng',
    lookupCookie: 'lng',
    lookupHeader: 'accept-language'
  },
  fallbackLng: 'en',
  preload: ['en', 'pl'],
  //load: 'languageOnly',
  saveMissing: true,
  cleanCode: true
});

const app = (0, _express.default)();
app.use(_helmet.default.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'dev.debesto.com']
  }
}));
app.use((0, _cors.default)({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  maxAge: 600
}));
app.use(_express.default.urlencoded({
  extended: true,
  limit: '2000kb'
}));
app.use(_express.default.json({
  limit: '2000kb'
}));
app.use((0, _compression.default)({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return _compression.default.filter(req, res);
  }
}));
app.use((0, _cookieParser.default)(process.env.SESSION_SECRET));
app.use(_i18nextHttpMiddleware.default.handle(_i18next.default));
app.use(_requestIp.default.mw());
app.use(_expressUseragent.default.express());
app.use(_expressWinston.default.logger({
  transports: [process.env.NODE_ENV === 'development' ? new _winston.default.transports.Console() : new _winston.default.transports.DailyRotateFile({
    dirname: _path.default.resolve(_path.default.join(__dirname, './logs')),
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '31d'
  }).on('rotate', function (_oldFilename, _newFilename) {
    /* UPLOAD TO CLOUD */
  })],
  format: _winston.default.format.combine(_winston.default.format.timestamp(), _winston.default.format.json()),
  requestField: null,
  responseField: null,
  // requestWhitelist: ['body', 'query'],
  meta: true,
  baseMeta: {},
  dynamicMeta: function (req, _res) {
    var _req$useragent, _req$useragent2, _req$useragent3, _req$useragent4, _req$useragent5;

    return {
      // method: req.method,
      // url: req.url,
      // user: req.user?.id,
      type: (_req$useragent = req.useragent) !== null && _req$useragent !== void 0 && _req$useragent.isDesktop ? 'Desktop' : (_req$useragent2 = req.useragent) !== null && _req$useragent2 !== void 0 && _req$useragent2.isMobile ? 'Mobile' : 'Bot',
      browser: (_req$useragent3 = req.useragent) === null || _req$useragent3 === void 0 ? void 0 : _req$useragent3.browser,
      // version: req.useragent?.version,
      os: (_req$useragent4 = req.useragent) === null || _req$useragent4 === void 0 ? void 0 : _req$useragent4.os,
      platform: (_req$useragent5 = req.useragent) === null || _req$useragent5 === void 0 ? void 0 : _req$useragent5.platform,
      ip: req.clientIp
    };
  },
  msg: 'HTTP {{req.httpVersion}} {{req.method}} {{req.url}} {{res.statusCode}}',
  expressFormat: false,
  colorize: false,
  ignoreRoute: function (_req, _res) {
    return false;
  }
})); // routes

app.use('/api', (res, req, next) => {
  next();
}, _api.default);

const staticFileMiddleware = _express.default.static(_path.default.join(__dirname, 'vue'));

app.use('/', staticFileMiddleware);
app.use((0, _connectHistoryApiFallback.default)({
  disableDotRule: true,
  verbose: true
}));
app.use(staticFileMiddleware);
app.use('/', (res, req, next) => {
  next();
}); // https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md#configuring-the-middleware
// Catch 404 and forward to error handler

app.use((req, _res, next) => {
  if (!req.route) return next(new _httpErrors.default.NotFound());
  next();
}); // Log errors

app.use((
/** @type {ErrorHandler} */
err,
/** @type {Request} */
req,
/** @type {Response} */
res,
/** @type {NextFunction} */
_next) => {
  //if (process.env.NODE_ENV === 'development' || err.statusCode == 500) logger.error(err);
  (0, _error.handleError)(err, req, res);
});
app.listen(process.env.PORT || 3000, () => _logger.default.info(`App listening on ${process.env.PORT || 3000}!`));
process.on('unhandledRejection', error => {
  _logger.default.error('##### unhandledRejection #####\n', error);
});
process.on('uncaughtException', error => {
  _logger.default.error('##### uncaughtException #####\n', error);
});
var _default = app;
exports.default = _default;