import fs from 'fs';
import { Workbook } from 'exceljs';
import generateExcelBook, { IExcelSummaryData } from './GenerateExcelBook';
import GenerateReportData from './ReportData';
import { TripRequest } from '../../database';

export class ReportGeneratorService {
  allowedTypes: string[];

  reportType: string;

  numberOfMonthsBack: number;

  constructor(numberOfMonthsBack = 1, reportType = 'excel') {
    this.allowedTypes = ['excel', 'csv'];
    this.reportType = reportType;
    this.numberOfMonthsBack = numberOfMonthsBack;
    if (!this.allowedTypes.includes(reportType)) {
      throw Error(`The allowed report types are [${this.allowedTypes}]`);
    }
  }

  generateMonthlyReport(): Promise<TripRequest[]> {
    return GenerateReportData.getReportData(this.numberOfMonthsBack);
  }

  getEmailAttachmentFile(tripData: TripRequest[]): Workbook {
    if (!Array.isArray(tripData)) throw Error('headers should be an array');

    if (this.reportType === 'excel') {
      return generateExcelBook.getWorkBook(tripData);
    }
    throw Error(`The allowed report types are [${this.allowedTypes}]`);
  }

  async writeAttachmentToStream(workBook: Workbook): Promise<fs.WriteStream> {
    if (!workBook || typeof workBook !== 'object') throw Error('A workbook object is required');
    const stream = fs.createWriteStream('excel.xlsx', { autoClose: true, flags: 'w' });
    await workBook.xlsx.write(stream);
    return stream;
  }

  async getMonthlyTripsSummary(monthsBack: number): Promise<IExcelSummaryData> {
    const monthOneTripData = await GenerateReportData.getReportData(monthsBack);
    const totalSummary = GenerateReportData.generateTotalsSummary(monthOneTripData);
    return totalSummary;
  }

  async getOverallTripsSummary(): Promise<IOverAllTripSummary> {
    const monthOneSummary = await this.getMonthlyTripsSummary(1);
    const {
      totalTripsCompleted: monthTwoTripsCompleted,
    } = await this.getMonthlyTripsSummary(2);

    const percentage = GenerateReportData.calculateLastMonthPercentageChange(
      monthOneSummary.totalTripsCompleted, monthTwoTripsCompleted,
    );

    return { ...monthOneSummary, percentageChange: percentage };
  }
}

const reportGeneratorService = new ReportGeneratorService();
export default reportGeneratorService;

export interface IOverAllTripSummary {
  percentageChange: string;
  month?: string;
  totalTrips?: any;
  totalTripsDeclined?: number;
  totalTripsCompleted?: number;
  departments: any;
}
