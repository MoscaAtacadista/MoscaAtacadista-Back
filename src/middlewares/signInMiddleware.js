import { signInSchema } from '../schemas/signInSchema.js';
import { STATUS_CODE } from '../enums/statusCode.js';

function signInValidation(request, response, next) {
    const user = response.locals.body;
    const { value, error } = signInSchema.validate(user);

    if (error === undefined) {
        response.locals.body = value;

        next();
        return
    }

    response.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send("Por favor, preencha o formulário corretamente.");
}

export { signInValidation }