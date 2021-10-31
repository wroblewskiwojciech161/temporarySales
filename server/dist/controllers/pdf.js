"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _dayjs = _interopRequireDefault(require("dayjs"));

class PdfController {
  /**
   * gets pdf base from html
   */
  static async getPdf(req, res, next) {
    const {
      data
    } = req.body;
    const url = process.env.PDF_PARSER_URL || "";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${req.cookies.pdftoken}`
    };
    const result = await _axios.default.post(url, data, {
      headers: headers
    });
    if (result === undefined) res.status(500).send("PDF conversion.Error during parsing html");else res.status(200).send(result.data);
  }
  /**
   * pdf service authentication
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */


  static async authorization(req, res, next) {
    const url = process.env.PDF_AUTH_URL || "";
    let data = {
      email: process.env.PDF_AUTH_EMAIL,
      password: process.env.PDF_AUTH_PASSWORD
    };
    const result = await _axios.default.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }).catch(next);
    if (result === undefined) res.status(500).send("PDF conversion.Error during authentication");else {
      res.cookie("pdftoken", result.data.access_token, {
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        expires: (0, _dayjs.default)().add(30, "days").toDate()
      }).status(200).send(true);
    }
  }

}

exports.default = PdfController;