import { convertArrayToCSV } from 'convert-array-to-csv';
import ExportData from '../../utils/ExportData';
import HttpError from '../../helpers/errorHandler';
import BugsnagHelper from '../../helpers/bugsnagHelper';


class ExportDocument {
  static async exportToPDF(req, res) {
    const { headers: { homebaseid }, query: { table } } = req;
    const pdf = await ExportData.createPDF(req.query, homebaseid);

    pdf.pipe(res);
    pdf.end();

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${table}.pdf`
    });
  }

  static async exportToCSV(req, res) {
    try {
      const { headers: { homebaseid }, query: { table } } = req;
      const data = await ExportData.createCSV(req.query, homebaseid);
      const csv = convertArrayToCSV(data);
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${table}.csv`
      });
      res.write(csv);
      res.end();
    } catch (e) {
      BugsnagHelper.log(e);
      const errorMessage = {
        message: 'Could not complete the process'
      };
      return HttpError.sendErrorResponse(errorMessage, res);
    }
  }
}

export default ExportDocument;
