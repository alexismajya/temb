import { Workbook, Worksheet, Fill } from 'exceljs';
import { TripRequest } from '../../database';
import Utils from '../../utils/index';
import generateReportData from './ReportData';

class GenerateExcelBook {
  getCellStyle(isColHeader: boolean) {
    if (isColHeader) {
      return {
        name: 'Times New Roman', color: { argb: '000000' }, family: 2, size: 13, bold: true,
      };
    }
    return {
      name: 'Times New Roman', color: { argb: '000000' }, size: 11, bold: false,
    };
  }

  getCellFillColor(color: string) {
    return {
      type: 'gradient',
      gradient: 'angle',
      degree: 0,
      stops: [
        { position: 0, color: { argb: color } }, { position: 1, color: { argb: color } },
      ],
    };
  }

  getWorkBook(tripData: TripRequest[]): Workbook {
    const workbook = this.getNewWorkBook(2);

    const sheet1 = workbook.getWorksheet(1);
    this.prepareSummary(sheet1, tripData);

    const sheet2 = workbook.getWorksheet(2);
    sheet2.name = 'Trip Details';
    sheet2.mergeCells('A2:K3');
    sheet2.columns.forEach((column) => { // eslint-disable-next-line no-param-reassign
      column.width = 24;
    });
    const pageHeader = sheet2.getCell('K3');
    this.prepareSheetMainHeader(pageHeader, 'Details');
    const headers = [
      'S/N', 'Requested On', 'Departure Date', 'Pickup', 'Destination',
      'Requested By', 'Department', 'Passenger', 'Approved By', 'Confirmed By',
    ];
    this.populateSheetRowData(sheet2, headers, 'A', 5, true);
    this.generateRows(sheet2, tripData, 'A', 6);
    return workbook;
  }

  getNewWorkBook(numberOfSheets: number): Workbook {
    const workBook = new Workbook();
    workBook.lastModifiedBy = 'Tembea Bot';
    workBook.created = new Date();
    workBook.modified = new Date();
    for (let i = 1; i <= numberOfSheets; i += 1) {
      workBook.addWorksheet(`Sheet${i}`);
    }
    return workBook;
  }

  prepareSummaryCellHeader(summaryCell: any): void {
    const summaryCellHeader = summaryCell;
    summaryCellHeader.value = 'Summary';
    summaryCellHeader.alignment = { vertical: 'middle', horizontal: 'center' };
    summaryCellHeader.font = {
      color: { argb: 'ffffff' }, bold: true, family: 1, size: 14, name: 'Times New Roman',
    };
    summaryCellHeader.fill = this.getCellFillColor('1768ff');
  }

  prepareSheetMainHeader(pageHeaderCell: any, title: string): void {
    const pageHeader = pageHeaderCell;
    const previousMonth = Utils.getPreviousMonth();
    pageHeader.value = `Title: ${title} of trips taken in ${previousMonth}`;
    pageHeader.font = {
      name: 'Times New Roman',
      color: { argb: '0540CC' },
      family: 2,
      size: 16,
      underline: true,
      bold: true,
    };
    pageHeader.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
  }

  populateSheetRowData(
    sheetRef: Worksheet, data: any[], startColumn: string, startRow: number, isColHeader = false,
  ): void {
    const sheet = sheetRef;

    let currentColumn = startColumn;
    data.forEach((item: any, index: any) => {
      const currentCell = `${currentColumn}${startRow}`;
      sheet.getCell(currentCell).value = data[index];
      sheet.getCell(currentCell).font = this.getCellStyle(isColHeader);

      currentColumn = Utils.nextAlphabet(currentColumn);
    });
  }

  generateRows(sheet: any, tripData: TripRequest[], startCol: string, startRow: number): void {
    const startColumn = startCol;
    let currentRow = startRow;
    tripData.forEach((record) => {
      const data = [
        record.id,
        Utils.formatDate(record.createdAt),
        Utils.formatDate(record.departureTime),
        (record.origin) ? record.origin.address : '',
        (record.destination) ? record.destination.address : '',
        record.requester ? record.requester.name : '',
        record.department ? record.department.name : '',
        record.rider ? record.rider.name : '',
        record.approver ? record.approver.name : '',
        record.confirmer ? record.confirmer.name : '',
      ];
      this.populateSheetRowData(sheet, data, startColumn, currentRow);
      currentRow += 1;
    });
  }

  prepareSummary(sheetRef: Worksheet, tripData: TripRequest[]): void {
    const sheet = sheetRef;
    sheet.name = 'Summary';
    sheet.mergeCells('A2:D3');
    sheet.columns.forEach((column: { width: number }) => {
      // eslint-disable-next-line no-param-reassign
      column.width = 20;
    });
    const pageHeader = sheet.getCell('D3');
    this.prepareSheetMainHeader(pageHeader, 'Summary');

    sheet.mergeCells('A5:D5');

    const summaryCellHeader = sheet.getCell('D5');
    this.prepareSummaryCellHeader(summaryCellHeader);

    const summary = generateReportData.generateTotalsSummary(tripData);
    const summaryHeaders = ['Department', 'Completed trips', 'Declined', 'Total'];
    this.populateSheetRowData(sheet, summaryHeaders, 'A', 7, true);

    this.fillSummaryData(summary, sheet);
  }

  fillSummaryData(summary: IExcelSummaryData, sheetRef: Worksheet): void {
    const sheet = sheetRef;
    const startColumn = 'A';
    let currentRow = 8;
    let currentColumn = startColumn;
    const departments = Object.keys(summary.departments);

    departments.forEach((department) => {
      const currentCell = `${currentColumn}${currentRow}`;
      sheet.getCell(currentCell).value = department !== 'null' ? department : '';
      sheet.getCell(currentCell).font = { bold: true, name: 'Times New Roman' };

      ['completed', 'declined', 'total'].forEach((property) => {
        currentColumn = this.fnFillDataRows(
          sheetRef, currentRow, summary, currentColumn, department, property,
        );
      });
      currentRow += 1;
      currentColumn = startColumn;
    });

    this.fillTotalRows(
      currentRow, currentColumn, sheet, summary, startColumn,
    );
  }

  fillTotalRows(
    currentRowVal: number, currentColumnVal: string, sheetRef: Worksheet,
    summary: IExcelSummaryData, startColumn: string,
  ): ITotalRows {
    let currentRow = currentRowVal;
    let currentColumn = currentColumnVal;
    const sheet = sheetRef;
    currentRow += 1;
    const currentCell = `${currentColumn}${currentRow}`;
    sheet.getCell(currentCell).value = 'TOTALS:';
    sheet.getCell(currentCell).fill = this.getCellFillColor('ffd891') as Fill;

    ['totalTripsCompleted', 'totalTripsDeclined', 'totalTrips'].forEach((property) => {
      currentColumn = this.fnFillTotalColumns(
        sheetRef, currentRow, summary, currentColumn, property,
      );
    });

    const range = `${startColumn}${currentRow}:
    ${String.fromCharCode(startColumn.charCodeAt(0) + 3)}${currentRow}`;

    sheet.getCell(range).font = { bold: true, name: 'Times New Roman' };
    return { currentRow, currentColumn };
  }

  fnFillDataRows(
    sheetRef: Worksheet, currentRow: number, summary: IExcelSummaryData,
    currentCol: string, department: string, property: string,
  ): string {
    const sheet = sheetRef;
    const currentColumn = Utils.nextAlphabet(currentCol);
    const currentCell = `${currentColumn}${currentRow}`;
    sheet.getCell(currentCell).value = summary.departments[department][property];
    return currentColumn;
  }

  fnFillTotalColumns(
    sheetRef: Worksheet, currentRow: number, summary: any,
    currentCol: string, property: string
  ): string {
    const sheet = sheetRef;
    const currentColumn = Utils.nextAlphabet(currentCol);
    const currentCell = `${currentColumn}${currentRow}`;
    sheet.getCell(currentCell).value = summary[property];
    return currentColumn;
  }
}
const generateExcelBook = new GenerateExcelBook();
export default generateExcelBook;

export interface IExcelSummaryData {
  month?: string;
  totalTrips?: any;
  totalTripsDeclined?: number;
  totalTripsCompleted?: number;
  departments: any;
}

export interface IGetCellFillColor {
  type: string;
  gradient: string;
  degree: number;
  stops: {
      position: number;
      color: {
          argb: string;
      };
  }[];
}

export interface ITotalRows {
  currentRow: number;
  currentColumn: string;
}
