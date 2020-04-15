import database from '../../database';
import { BaseService } from '../shared/base.service';
import TripDetail from '../../database/models/trip-details';

interface TripDetailData{
  riderPhoneNo: string;
  travelTeamPhoneNo: string;
  flightNumber: string;
}

export class TripDetailsService extends BaseService<TripDetail, number> {
  constructor(model = database.getRepository(TripDetail)) {
    super(model);
  }

  async createDetails(data: TripDetailData) {
    const tripDetailInformation = {
      riderPhoneNo: data.riderPhoneNo,
      travelTeamPhoneNo: data.travelTeamPhoneNo,
      flightNumber: data.flightNumber,
    };
    const tripDetail = await this.add(tripDetailInformation);
    return tripDetail;
  }
}

const tripDetail = new TripDetailsService();

export default tripDetail;
