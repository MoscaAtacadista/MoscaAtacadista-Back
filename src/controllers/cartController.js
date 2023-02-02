import { COLLECTIONS } from '../enums/collections.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import database from '../database/database.js';
import { DEFAULT_VALUES } from '../enums/defaultValues.js';
import mongoose from 'mongoose';

async function getCartProduct (request, response) {
    const productsdb = database.collection(COLLECTIONS.CARTS);

    try {
        const products = await productsdb.find({}).toArray();
        
        if (products.length === 0) {
            response.status(STATUS_CODE.NOT_FOUND).send([])
            return;
        }

        response.send(products);
        
    } catch (err) {
        response.sendStatus(STATUS_CODE.SERVER_ERROR)
        console.log(err.message);
    }
}

async function postCartProduct (request, response) {
    const productId = request.headers.productid;
    const userId = response.locals.userId;

    try {
        const product = await database.collection(COLLECTIONS.PRODUCTS).findOne({ _id: mongoose.Types.ObjectId(productId)});

        if (!product) {
            response.status(STATUS_CODE.NOT_FOUND).send([])
            return;
        } 
        
        const user = await database.collection(COLLECTIONS.USERS).findOne({_id: userId });
        
        if (!user) {
            response.status(STATUS_CODE.NOT_FOUND).send([])
            return;
        }

        delete product._id;
        product['userId'] = userId.toString();

        await database.collection(COLLECTIONS.CARTS).insertOne(product);
        response.sendStatus(STATUS_CODE.OK);
        
    } catch (err) {
        response.sendStatus(STATUS_CODE.SERVER_ERROR)
        console.log(err.message);
    }
}

async function deleteCartProduct (request, response) {
    const productId = request.headers.productid;
    console.log(productId)
    console.log("aqui")
    const userId = response.locals.userId;

    try {
        const product = await database.collection(COLLECTIONS.CARTS).findOne({ _id: mongoose.Types.ObjectId(productId)});
        
        if (!product) {
            response.status(STATUS_CODE.NOT_FOUND).send([])
            return;
        } 

        if (product.userId !== userId.toString()) {
            response.status(STATUS_CODE.NOT_FOUND).send([])
            return;
        }

        await database.collection(COLLECTIONS.CARTS).deleteOne({ _id: mongoose.Types.ObjectId(productId)});
        response.sendStatus(STATUS_CODE.OK);
        
    } catch (err) {
        response.sendStatus(STATUS_CODE.SERVER_ERROR)
        console.log(err.message);
    }
}

export { getCartProduct, postCartProduct, deleteCartProduct};