"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = exports.ErrorHandler = void 0;

class ErrorHandler extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }

}
/**
 * @param {ErrorHandler} err
 * @param {Request} _req
 * @param {Response} res
 */


exports.ErrorHandler = ErrorHandler;

const handleError = (err, _req, res) => {
  const {
    statusCode,
    message
  } = err;
  res.status(statusCode ? statusCode : 500).send({
    status: 'error',
    statusCode: statusCode ? statusCode : 500,
    message: message
  });
};

exports.handleError = handleError;