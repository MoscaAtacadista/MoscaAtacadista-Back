import express from 'express';
import { htmlSanitizer } from '../middlewares/htmlSanitizer.js';
import { sessionVerifier } from '../middlewares/authorizationMiddleware.js';
import { getCartProduct, postCartProduct, deleteCartProduct } from '../controllers/cartController.js';

const router = express.Router();

router.get('/cart', htmlSanitizer, sessionVerifier, getCartProduct);
router.post('/cart', htmlSanitizer, sessionVerifier, postCartProduct);
router.delete('/cart', htmlSanitizer, sessionVerifier, deleteCartProduct);

export default router;