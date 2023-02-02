import express from "express";
import { htmlSanitizer } from "../middlewares/htmlSanitizer.js";
import { signup, getUser, putUser } from "../controllers/userController.js";
import { signUpValidation } from "../middlewares/userMiddleware.js";
import { sessionVerifier } from "../middlewares/authorizationMiddleware.js";

const router = express.Router();

router.post("/user", htmlSanitizer, signUpValidation, signup);
router.get("/user", htmlSanitizer, sessionVerifier, getUser);
router.put("/user", htmlSanitizer, sessionVerifier, putUser);

export default router;
