import { Router } from 'express';
import ExportDocument from './ExportsController';
import middlewares from '../../middlewares';
import Midd from '../../middlewares/ValidationSchemas';

const exportsRouter = Router();
const { mainValidator } = middlewares;

/**
 * @swagger
 * /export/pdf:
 *  get:
 *    summary: export data to pdf
 *    tags:
 *      - Export
 *    parameters:
 *      - name: homebaseid
 *        in: header
 *        type: number
 *        description: id of the homebase
 *      - name: table
 *        in: query
 *        required: true
 *        description: name of database table to get data from
 *        type: string
 *      - name: sort
 *        in: query
 *        required: false
 *        type: string
 *      - name: department
 *        in: query
 *        required: false
 *        description: department to filter trip requests by
 *        type: string
 *      - name: dateFilters
 *        in: query
 *        required: false
 *        type: string
 *    responses:
 *      200:
 *        description: download the response
 */
exportsRouter.get('/export/pdf', mainValidator(Midd.exportToDocument), ExportDocument.exportToPDF);

/**
 * @swagger
 * /export/csv:
 *  get:
 *    summary: export data to csv
 *    tags:
 *      - Export
 *    parameters:
 *      - name: homebaseid
 *        in: header
 *        type: number
 *        description: id of the homebase
 *      - name: table
 *        in: query
 *        required: true
 *        description: name of database table to get data from
 *        type: string
 *      - name: sort
 *        in: query
 *        required: false
 *        type: string
 *      - name: department
 *        in: query
 *        required: false
 *        description: department to filter trip requests by
 *        type: string
 *      - name: dateFilters
 *        in: query
 *        required: false
 *        type: string
 *    responses:
 *      200:
 *        description: success
 */
exportsRouter.get('/export/csv', mainValidator(Midd.exportToDocument), ExportDocument.exportToCSV);


export default exportsRouter;
