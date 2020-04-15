import { BaseService } from '../shared/base.service';
import Homebase from '../../database/models/homebase';
import { Op } from 'sequelize';
import database from '../../database';
import UserService from '../users/user.service';
import { addressService } from '../addresses/address.service';
import tripService from '../trips/trip.service';
import Utils from '../../utils';

const { models: { Country, Embassy, Provider, TripRequest } } = database;

class HomebaseService extends BaseService <Homebase, number> {
  constructor(model = database.getRepository(Homebase)) {
    super(model);
  }

  async createHomebase(args: HomebaseCreationProps): Promise<object | Error> {
    const { name, channel, address, countryId, currency, opsEmail, travelEmail } = args;
    const newHomebaseName = this.formatName(name);
    const homebaseAddress = await addressService.findOrCreateAddress(address.address,
      address.location);

    if (homebaseAddress.longitude == null || homebaseAddress.latitude == null) {
      throw new Error('please provide address location');
    }

    const [homebase] = await this.model.findOrCreate<Homebase>({
      where: { name: { [Op.iLike]: `${newHomebaseName.trim()}%` } },
      defaults: {
        countryId,
        channel,
        currency,
        opsEmail,
        travelEmail,
        name: newHomebaseName.trim(),
        addressId: homebaseAddress.id,
      },
    });

    // @ts-ignore
    const { _options: { isNewRecord } } = homebase;

    return {
      homebase: homebase.get(),
      isNewHomebase: isNewRecord,
    };
  }

  formatName(homebaseName: string): string {
    const lowercasedName = homebaseName.toLowerCase();
    return lowercasedName.charAt(0).toUpperCase() + lowercasedName.slice(1);
  }

  getWhereClause(whereObject: GetWhereClauseParam): object {
    let where = {};
    const { country, name } = whereObject;
    if (country) where = { country: this.formatName(country) };
    if (name) where = { ...where, name: this.formatName(name) };
    return where;
  }

  async getHomebases(pageable: Pageable, where = {}): Promise<object> {
    const { pageMeta: { totalPages, limit, count, page }, data } = await this.getPaginated({
      page: pageable.page,
      limit: pageable.size,
      defaultOptions: this.createFilter(where),
    });

    return {
      totalPages,
      homebases: data.map((item) => ({
        id: item.id,
        homebaseName: item.name,
        channel: item.channel,
        country: item.country ? item.country.name : null,
        addressId: item.addressId,
        locationId: item.locationId,
        currency: item.currency,
        opsEmail: item.opsEmail,
        travelEmail: item.travelEmail,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      totalItems: count,
      pageNo: page,
      itemsPerPage: limit,
    };
  }

  createFilter(where: any): object {
    const { country: name } = where;
    if (name) {
      return {
        where,
        include: { model: Country, as: 'country', where: { name } },
      };
    }
    delete where.country;
    return { where, include: ['country'] };
  }

  // tslint:disable-next-line: prefer-array-literal
  async getAllHomebases(withForeignKey = false) {
    const homebases = await this.findAll({
      attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
      order: [['name', 'ASC']],
      include: withForeignKey ? [{ model: Country, as: 'country', attributes: ['name'] }] : [],
    });
    return homebases;
  }

  async getHomeBaseBySlackId(slackId: string, withForeignKey = false) {
    const { homebaseId } = await UserService.getUserBySlackId(slackId);
    const homebase = await this.findById(
      homebaseId,
      withForeignKey ? [{ model: Country, as: 'country', attributes: ['name'] }] : [],
      ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
    );
    return homebase;
  }

  async findHomeBaseByChannelId(channelId: string) {
    const homebase = await this.findOneByProp({ prop: 'channel', value: channelId });
    return homebase ? homebase : {};
  }

  async getById(homebaseId: number) {
    const homeBase = await this.findById(homebaseId);
    return homeBase;
  }

  async getByName(homebaseName: string) {
    const homeBase = await this.findOneByProp({
      prop: 'name', value: { [Op.iLike]: homebaseName },
    });
    return homeBase;
  }

  async updateDetails(
    name: string, id: number, channel: string, countryId: number,
    address: AddressProps, currency: string, opsEmail: string, travelEmail: string) {
    const homebaseAddress = await addressService
    .findOrCreateAddress(address.address, address.location);
    if (homebaseAddress.longitude == null || homebaseAddress.latitude == null) {
      throw new Error('please provide address location');
    }

    try {
      const foundname = await this.getByName(name);
      if (foundname) return { error: `Homebase with name '${name}' already exists` };
      const homebase = await this.update(id, {
        name, channel, countryId, currency, opsEmail, travelEmail, addressId: homebaseAddress.id });
      return homebase;
    } catch (err) {
      return (err.message);
    }
  }

  async getHomeBaseEmbassies(slackId: string, searchKey?: string) {
    let embassies = [];
    const { id } = await this.getHomeBaseBySlackId(slackId);
    const { countryId } = await this.getById(id);
    if (searchKey) {
      embassies = await Embassy.findAll({ where: {
        countryId,
        name: { [Op.iLike]: `%${searchKey}%` },
      } });
    }
    embassies = await Embassy.findAll({ where: { countryId } });
    return embassies;
  }

  filterHomebase(homebase: Homebase, homebases: Homebase[]) {
    return homebase ? homebases.filter(
        (currentHomeBase: { name: any; }) => currentHomeBase.name !== homebase.name,
      ) : homebases;
  }

  async getMonthlyCompletedTrips() {
    const dateFilter = tripService.sequelizeWhereClauseOption({
      requestedOn: { after: Utils.getPreviousMonthsDate(1) },
    });
    const where = { tripStatus: 'Completed', ...dateFilter };
    return await this.findAll({
      attributes: ['id', 'name', 'channel', 'opsEmail'],
      order: [['name', 'ASC']],
      include:[{ model: Provider,
        attributes: ['name'],
        required: true,
        include: [{
          where,
          model: TripRequest,
          attributes: ['name', 'createdAt'],
        }],
      }],
    });
  }
}

export interface Pageable {
  page: number;
  size: number;
  sort: any[];
}

interface GetWhereClauseParam {
  country: string;
  name: string;
}

interface LocationProps {
  longitude: number;
  latitude: number;
}

interface AddressProps {
  address: string;
  location: LocationProps;
}

interface HomebaseCreationProps {
  name: string;
  channel: string;
  address: AddressProps;
  countryId: number;
  currency: string;
  opsEmail: string;
  travelEmail: string;
}

export const homebaseService = new HomebaseService();

export default HomebaseService;
