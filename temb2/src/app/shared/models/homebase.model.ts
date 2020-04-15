export interface IHomeBase {
  homebaseName?: string;
  channel?: string;
  countryId?: number;
  address?: string;
  currency?: string;
  opsEmail?: string;
  travelEmail?: string;
}


export class HomebaseModel implements IHomeBase {
  constructor(
    public homebaseName?: string,
    public channel?: string,
    public countryId?: number,
    public address?: string,
    public currency?: string,
    public opsEmail?: string,
    public travelEmail?: string,
  ) {}
}
