import { COLLECTIONS } from "../enums/collections.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import database from "../database/database.js";
import { CATEGORIES } from "../enums/products.js";
import { DEFAULT_VALUES } from "../enums/defaultValues.js";

async function getProductByCategory(request, response) {
  const category = response.locals.params.category;
  const validCategory = CATEGORIES.includes(category);
  const limit =
    response.locals.query === undefined
      ? DEFAULT_VALUES.GET_PRODUCTS_LIMIT
      : response.locals.query.limit;
  const products = database.collection(COLLECTIONS.PRODUCTS);

  try {
    if (!validCategory) {
      response
        .status(STATUS_CODE.NOT_FOUND)
        .send("This category does not exist");
      return;
    }

    const productsByCategory = await products
      .find({ category: category }, { limit: Number(limit) })
      .toArray();

    if (productsByCategory.length === 0) {
      response.status(STATUS_CODE.OK).send([]);
      return;
    }

    response.send(productsByCategory);
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

export { getProductByCategory };
