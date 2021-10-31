import { Request, Response, NextFunction } from 'express';

// Controllers odpowiadają ża obłużenie żądania, same nie komunikują się bezpośrednio z bazą, tylko po przez services
// Oprócz tego powinny nie zawierać większej logiki (nie znaczy to że nie mogą korzystać z kilku servieces -- więc coś wiedzą)
// Mogą/powinny validować zapytanie lub korzystać z innych usług services/helpers ktore to wykonują/ułatwiają

export default class AuthController {
  /**
   * @param {Request} req
   * @param {Response} res
   */
  static async logout(req, res) {
    // req.logout();
    // req.session.destroy(() => {
    //   res.clearCookie('_SID');
    //   res.status(200).send({
    //     message: req.t('Logged out'),
    //   });
    // });
  }
}
