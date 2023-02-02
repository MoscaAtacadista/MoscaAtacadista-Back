import { COLLECTIONS } from '../enums/collections.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import database from '../database/database.js';
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function postSignIn(req, res) {
    const { email, password } = res.locals.body;
    const sessions = database.collection(COLLECTIONS.SESSIONS);
    const users = database.collection(COLLECTIONS.USERS);
        
    try {
        let user = await users.findOne({ 'email': email });

        if (!user) {
            user = await users.findOne({ 'name': email });
            
            if (!user) {
                res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send("Esse e-mail e/ou nome de usuário não é de nenhum usuário!");
                return
            };
        };
        
        const validPassword = bcrypt.compareSync(password, user.password);

        if (validPassword){
            const token = uuid();

            sessions.insertOne({
                userId: user._id,
                sessionId: token,
                sessionStart: Date.now(),
                isDeleted: false
            });

            res.status(STATUS_CODE.CREATED).send(token);
            return;
        }

        res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send("Senha incorreta!");
    } catch (err) {
        res.sendStatus(STATUS_CODE.SERVER_ERROR)
        console.log(err.message);
    }
}

export { postSignIn };