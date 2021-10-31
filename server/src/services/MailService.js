import nodemailer from "nodemailer";
import createError from "http-errors";
import renderTemplate from "../helpers/renderTemplate"

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_AUTH_USER, // generated ethereal user
    pass: process.env.MAIL_AUTH_PASS, // generated ethereal password
  },
});

/**
 * Mail service
 * sends mail with given configuraion link
 */
export class MailService {
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

  static async sendMail(contact,templatePath,options) {
  
    const htmlContent = await renderTemplate(templatePath,options)

    const messageStatus = await transporter.sendMail({
      from: process.env.FROM_MAIL,
      to: contact.email,
      subject: options.mailSubject,
      html: htmlContent,
    });

    if (!messageStatus)
      throw new createError.InternalServerError("sending mail error");
  }
}
