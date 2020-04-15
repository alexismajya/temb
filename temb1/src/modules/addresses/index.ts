import express from 'express';
import addressController from './address.controller';
import middlewares from '../../middlewares';

const {
  AddressValidator, GeneralValidator
} = middlewares;

const addressRouter = express.Router();

/**
 * @swagger
 * /addresses:
 *  post:
 *    summary: adds a new address
 *    description: "Authentication required"
 *    tags:
 *      - Addresses
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - longitude
 *            - latitude
 *            - address
 *          properties:
 *            longitude:
 *              type: number
 *            latitude:
 *              type: number
 *            address:
 *              type: string
 *    responses:
 *      201:
 *        description: when the address was successfully created
 *        schema:
 *          type: object
 *      400:
 *        description: bad request
 *      401:
 *        description: when not authenticated
 */
addressRouter.post(
  '/addresses',
  AddressValidator.validateAddressBody,
  AddressValidator.validateaddress,
  addressController.addNewAddress.bind(addressController)
);

/**
 * @swagger
 * /addresses:
 *  put:
 *    summary: update an existing address
 *    tags:
 *      - Addresses
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        type: string
 *        schema:
 *          type: object
 *          required:
 *            - address
 *          properties:
 *            newLongitude:
 *              type: number
 *            newLatitude:
 *              type: number
 *            address:
 *              type: string
 *            newAddress:
 *              type: string
 *    responses:
 *      200:
 *        description: when the address is successfully updated
 *      400:
 *        description: bad request
 */
addressRouter.put(
  '/addresses',
  AddressValidator.validateAddressUpdateBody,
  AddressValidator.validateUpdateaddress,
  addressController.updateAddress.bind(addressController)
);

/**
 * @swagger
 * /addresses:
 *  get:
 *    summary: get all addresses on the database
 *    description: supports pagination
 *    tags:
 *      - Addresses
 *    parameters:
 *      - name: page
 *        in: query
 *        required: false
 *        description: page number
 *        type: number
 *      - name: size
 *        in: query
 *        required: false
 *        description: number of items per page
 *        type: number
 *    responses:
 *      200:
 *        description: response object contains all addresses on the db
 *      400:
 *        description: bad request
 */
addressRouter.get(
  '/addresses',
  GeneralValidator.validateQueryParams,
  addressController.getAddresses.bind(addressController),
);

/**
 * @swagger
 * /addresses/{id}:
 *  get:
 *    summary: get address by ID
 *    tags:
 *      - Addresses
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: number
 *    responses:
 *      200:
 *        description: response object contains all addresses on the db
 *      400:
 *        description: bad request
 */
addressRouter.get(
  '/addresses/:id',
  GeneralValidator.validateIdParam,
  addressController.getSingleAddress.bind(addressController),
);

export default addressRouter;
