import Utils from '../../utils';

export interface ITripInfo {
  name?: string;
  embassyVisit: number;
  regularTrip: number;
  airportTransfer: number;
  routeTrip?: number;
  total?: number;
  date: string;
}

export interface IUserData { [key: string] : ITripInfo; }

class WeeklyReportGenerator {
  defaultInfo: ITripInfo = {
    embassyVisit: 0,
    regularTrip: 0,
    airportTransfer: 0,
    routeTrip: 0,
    date: Utils.getLastWeekStartDate('LL'),
  };

  generateEmailData(userTripData: {[key: string] : any}[],
    userRouteData: {[key: string] : any}[]): IUserData {
    const userObject: any = {};
    userTripData.map((data) => {
      const tripTypeInfo = this.generateTotalByTripType(data);
      userObject[data.email] = tripTypeInfo;
    });
    const usersWithTrips = Object.keys(userObject);
    userRouteData.map((data) => {
      userObject[data.email] = usersWithTrips.includes(data.email)
        ? {...userObject[data.email],
          routeTrip: data.routes.length,
          total: userObject[data.email].total + data.routes.length,
        }
        : this.generateRouteInfo(data);
    });
    return userObject;
  }

  generateTotalByTripType(data: {[key: string] : any}): ITripInfo {
    const summary: ITripInfo = {
      ...this.defaultInfo,
      name: data.name,
      total: data.trips.length,
    };
    data.trips.forEach((trip: {[key: string] : string}) => {
      switch (trip.tripType) {
        case 'Embassy Visit':
          summary.embassyVisit += 1;
          break;
        case 'Airport Transfer':
          summary.airportTransfer += 1;
          break;
        default:
          summary.regularTrip += 1;
          break;
      }
    });
    return summary;
  }

  generateRouteInfo(route: {[key: string] : any}): ITripInfo {
    const routeTrips = route.routes.length;
    return {
      ...this.defaultInfo,
      name: route.name,
      routeTrip: routeTrips,
      total: routeTrips,
    };
  }
}
const weeklyReportGenerator = new WeeklyReportGenerator();
export default weeklyReportGenerator;
