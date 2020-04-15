/* eslint-disable max-len */
import moment from 'moment';
import Utils from '../../utils';
import tripService from '../trips/trip.service';
import { IExcelSummaryData } from './GenerateExcelBook';
import { TripRequest } from '../../database';

class GenerateReportData {
  async getReportData(numberOfMonthsBack: number): Promise<TripRequest[]> {
    const monthsBackDate = moment(new Date()).subtract({ months: numberOfMonthsBack }).format('YYYY-MM-DD');
    const dateFilters = {
      requestedOn: { after: monthsBackDate }
    };
    const where = tripService.sequelizeWhereClauseOption({ ...dateFilters });
    return tripService.getAll(
      { where },
      { order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']] }
    );
  }

  generateTotalsSummary(trips: TripRequest[]): IExcelSummaryData {
    const summary: IExcelSummaryData = {
      month: Utils.getPreviousMonth(),
      totalTrips: trips.length,
      totalTripsDeclined: 0,
      totalTripsCompleted: 0,
      departments: {},
    };
    trips.forEach((trip) => {
      if (!summary.departments[trip.department.name]) {
        summary.departments[trip.department.name] = { completed: 0, declined: 0, total: 0 };
      }

      if (trip.tripStatus === 'Completed') {
        summary.departments[trip.department.name].completed += 1;
        summary.totalTripsCompleted += 1;
      } else {
        summary.totalTripsDeclined += 1;
        summary.departments[trip.department.name].declined += 1;
      }
      summary.departments[trip.department.name].total += 1;
    });
    return summary;
  }

  calculateLastMonthPercentageChange(
    totalTripsCompletedLastMonth: number, totalTakenTwoMonthsBack: number
  ): string {
    const percentage = (((totalTripsCompletedLastMonth - totalTakenTwoMonthsBack)
      / (totalTakenTwoMonthsBack || totalTripsCompletedLastMonth || 1)) * 100).toFixed(2);

    return percentage;
  }
}
const generateReportData = new GenerateReportData();
export default generateReportData;
