import { COLLECTIONS } from "../enums/collections.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import database from "../database/database.js";
import { DEFAULT_VALUES } from "../enums/defaultValues.js";
import mongoose from "mongoose";
import { newProductSchema } from "../schemas/productSchema.js";
import { CATEGORIES } from "../enums/products.js";

async function getProductById(request, response) {
  const productId = request.headers.productid;

  try {
    let product = await database
      .collection(COLLECTIONS.PRODUCTS)
      .findOne({ _id: mongoose.Types.ObjectId(productId) });

    if (!product) {
      product = await database
        .collection(COLLECTIONS.CARTS)
        .findOne({ _id: mongoose.Types.ObjectId(productId) });

      if (!product) {
        response.status(STATUS_CODE.NOT_FOUND).send([]);
        return;
      }

      response.send(product);
      return;
    }

    response.send(product);
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

async function getProduct(request, response) {
  const limit =
    response.locals.query === undefined
      ? DEFAULT_VALUES.GET_PRODUCTS_LIMIT
      : response.locals.query.limit;
  const productsdb = database.collection(COLLECTIONS.PRODUCTS);

  try {
    const products = await productsdb
      .find({}, { limit: Number(limit) })
      .toArray();

    if (products.length === 0) {
      response.status(STATUS_CODE.NOT_FOUND).send([]);
      return;
    }

    response.send(products);
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

async function postProduct(request, response) {
  try {
    const products = database.collection(COLLECTIONS.PRODUCTS);
    const body = response.locals.body;
    const { pictures } = body;
    body.pictures = pictures.split(",");
    const { value, error } = newProductSchema.validate(body);
    const categoryIsValid = CATEGORIES.includes(value.category);

    if (error !== undefined || !categoryIsValid) {
      response
        .status(STATUS_CODE.UNPROCESSABLE_ENTITY)
        .send("Invalid body request.");
      return;
    }

    await products.insertOne(value);
    response.sendStatus(STATUS_CODE.CREATED);
  } catch (err) {
    response.sendStatus(STATUS_CODE.SERVER_ERROR);
    console.log(err.message);
  }
}

export { getProduct, getProductById, postProduct };
