import joi from "joi";
import Joi from "joi";
import { DEFAULT_VALUES } from "../enums/defaultValues.js";
import { joiPasswordExtendCore } from "joi-password";

const JoiPassword = Joi.extend(joiPasswordExtendCore);

const signUpSchema = joi.object({
  name: joi.string().min(1).required(),
  email: Joi.alternatives().try(
    Joi.string()
      .email({ tlds: { allow: false } })
      .required(),

    Joi.string().required()
  ),
  profilePictureURL: joi.string().uri().default(DEFAULT_VALUES.PROFILE_PICTURE),
  password: JoiPassword.string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const changeUserSchema = joi.object({
  name: joi.string().min(1).required(),
  profilePictureURL: joi.string().uri().allow(""),
});

export { signUpSchema, signInSchema, changeUserSchema };
