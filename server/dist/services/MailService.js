"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MailService = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _renderTemplate = _interopRequireDefault(require("../helpers/renderTemplate"));

const transporter = _nodemailer.default.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_AUTH_USER,
    // generated ethereal user
    pass: process.env.MAIL_AUTH_PASS // generated ethereal password

  }
});
/**
 * Mail service
 * sends mail with given configuraion link
 */


class MailService {
  /**
   * 
   * @param {*} contact receiver data 
   * @param {string} templatePath path to html mail template
   *  {
   *       email: 'admin@gmail.com',
   *       phoneNumber: '777777777',
   *       policy: true,
   *       countryCode: '48'
   *  }
   * @param {*} options  options with defined template variables
   */
  static async sendMail(contact, templatePath, options) {
    const htmlContent = await (0, _renderTemplate.default)(templatePath, options);
    const messageStatus = await transporter.sendMail({
      from: process.env.FROM_MAIL,
      to: contact.email,
      subject: options.mailSubject,
      html: htmlContent
    });
    if (!messageStatus) throw new _httpErrors.default.InternalServerError("sending mail error");
  }

}

exports.MailService = MailService;