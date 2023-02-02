import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const JoiPassword = Joi.extend(joiPasswordExtendCore);

const signInSchema = Joi.object({
    email: Joi.alternatives().try(
            Joi
                .string()
                .email({tlds: { allow: false }})
                .required(),
        
            Joi
                .string()
                .required(),
    ),

    password: JoiPassword
        .string()
        .min(8)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required()
});

export { signInSchema };