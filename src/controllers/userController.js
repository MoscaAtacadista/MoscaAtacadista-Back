import { COLLECTIONS } from "../enums/collections.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import database from "../database/database.js";
import { changeUserSchema } from "../schemas/userSchema.js";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

async function signup(request, response) {
  try {
    const { email, profilePictureURL, password, name } = response.locals.body;
    const sessions = database.collection(COLLECTIONS.SESSIONS);
    const users = database.collection(COLLECTIONS.USERS);
    const user = await users.findOne({
      $or: [{ email: email }, { name: name }],
    });

    if (user !== null) {
      response
        .status(STATUS_CODE.UNPROCESSABLE_ENTITY)
        .send("Esse e-mail e/ou nome de usuário já está em uso");
      return;
    }

    const token = uuid();
    const hashedPassword = bcrypt.hashSync(password, 10);

    users
      .insertOne({
        email: email,
        name: name,
        profilePictureURL: profilePictureURL,
        password: hashedPassword,
        isDeleted: false,
      })
      .then((insertionResult) => {
        sessions.insertOne({
          userId: insertionResult.insertedId,
          sessionId: token,
          sessionStart: Date.now(),
          isDeleted: false,
        });
      });

    response.status(STATUS_CODE.CREATED).send(token);
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

async function getUser(request, response) {
  try {
    const userId = response.locals.userId;
    const users = database.collection(COLLECTIONS.USERS);
    const user = await users.findOne({ _id: userId });

    response.send({
      profilePictureURL: user.profilePictureURL,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

async function putUser(request, response) {
  try {
    const body = response.locals.body;
    const userId = response.locals.userId;
    const { error, value } = changeUserSchema.validate(body);
    const users = database.collection(COLLECTIONS.USERS);

    if (error !== undefined) {
      response.sendStatus(STATUS_CODE.UNPROCESSABLE_ENTITY);
      return;
    }

    await users.updateOne(
      { _id: userId },
      { $set: { name: value.name, profilePictureURL: value.profilePictureURL } }
    );

    response.sendStatus(STATUS_CODE.CREATED);
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

export { signup, getUser, putUser };
