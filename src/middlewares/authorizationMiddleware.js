import database from "../database/database.js";
import { COLLECTIONS } from "../enums/collections.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function sessionVerifier(request, response, next) {
  try {
    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");
    const sessions = database.collection(COLLECTIONS.SESSIONS);
    const userSession = await sessions.findOne({ sessionId: token });

    if (!token) {
      response
        .status(STATUS_CODE.BAD_REQUEST)
        .send("Authorization token is missing");
      return;
    }

    if (!userSession) {
      response
        .status(STATUS_CODE.UNAUTHORIZED)
        .send("Invalid Authorization token");
      return;
    }

    response.locals.userId = userSession.userId;
    next();
  } catch (err) {
    console.log(err.message);
  }
}

export { sessionVerifier };
