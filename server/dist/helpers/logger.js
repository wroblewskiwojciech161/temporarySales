"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _winston = _interopRequireDefault(require("winston"));

require("winston-daily-rotate-file");

/* Logger */
const {
  combine,
  timestamp,
  prettyPrint
} = _winston.default.format;

const logger = _winston.default.createLogger({
  exitOnError: false,
  handleExceptions: true,
  format: combine(timestamp(), prettyPrint()),
  transports: [new _winston.default.transports.DailyRotateFile({
    level: 'warn',
    handleRejections: true,
    dirname: _path.default.resolve(_path.default.join(__dirname, '../logs')),
    filename: '%DATE%.err',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles: '14d'
  }).on('rotate', function (_oldFilename, _newFilename) {
    /* UPLOAD TO CLOUD */
  })]
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new _winston.default.transports.Console({
    format: combine(timestamp(), prettyPrint())
  }));
}

var _default = logger;
exports.default = _default;