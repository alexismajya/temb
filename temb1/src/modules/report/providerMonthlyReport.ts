import { homebaseService } from '../../modules/homebases/homebase.service';
import Utils from '../../utils';

class ProviderReportGenerator {

  async generateData(channel: CommChannel): Promise<IHomebaseProviderReport> {
    const homebaseProvidersReport: IHomebaseProviderReport = {};
    const homebaseData = await homebaseService.getMonthlyCompletedTrips();
    homebaseData.map((homebase: {[key: string] : any}) => {
      const providerData = this.calculateTotal(homebase.providers);
      const singleHomebaseReport = this.getPercantage(providerData);
      singleHomebaseReport.name = homebase.name;
      singleHomebaseReport.month = Utils.getPreviousMonth();
      if (channel === 'email') {
        homebaseProvidersReport[homebase.opsEmail] = singleHomebaseReport;
      } else if (channel === 'slack') {
        homebaseProvidersReport[homebase.channel] = singleHomebaseReport;
      }
    });
    return homebaseProvidersReport;
  }

  calculateTotal(providers: IProviders[]): IHomebaseReport {
    let total = 0;
    const providersData = providers.map((provider: any) => {
      total += provider.trips.length;
      return { ...provider, trips: provider.trips.length };
    });
    return { total, providersData };
  }

  getPercantage(data: IHomebaseReport): IHomebaseReport {
    const newProviderData =  data.providersData.map((provider: IProviderData) => {
      provider.percantage = (provider.trips / data.total) * 100;
      return provider;
    });
    return { ...data, providersData: newProviderData };
  }
}
const providerReportGenerator = new ProviderReportGenerator();
export default providerReportGenerator;

export enum CommChannel {
  email = 'email',
  slack = 'slack',
}

export interface IHomebaseReport {
  total: number;
  month?: string;
  name?: string;
  providersData: IProviderData[];
}

export interface IProviderData {
  name: string;
  trips: number;
  percantage: number;
}

export interface IHomebaseProviderReport { [key: string] : IHomebaseReport; }

export interface IProviders {
  name: string;
  trips: ITrip[];
}

export interface ITrip {
  name: string;
  createdAt: string;
}
