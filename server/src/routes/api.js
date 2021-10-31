import { Router } from 'express';
import * as ExpressProxy from 'express-http-proxy';

const { default: proxy } = ExpressProxy;
/* Controllers */
import AuthController from '../controllers/auth';
import PdfController from '../controllers/pdf'

const router = Router();

router.get('/auth/logout', AuthController.logout);

router.get('/pdf/auth', PdfController.authorization);

router.post('/pdf/get', PdfController.getPdf);

router.use('/', proxy(process.env.API_URL));



export default router;
