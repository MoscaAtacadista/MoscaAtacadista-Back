
import express from 'express';
import { htmlSanitizer } from '../middlewares/htmlSanitizer.js';
import { postSignIn } from '../controllers/signInController.js';
import { signInValidation } from '../middlewares/signInMiddleware.js';

const router = express.Router();

router.post('/signIn', htmlSanitizer, signInValidation, postSignIn);

export default router;