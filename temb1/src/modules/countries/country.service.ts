import request from 'request-promise-native';
import { BaseService } from './../shared/base.service';
import { Op } from 'sequelize';
import HttpError from '../../helpers/errorHandler';
import Country from '../../database/models/country';
import database from '../../database';

class CountryService extends BaseService <Country, number>{
  constructor(country = database.getRepository(Country)) {
    super(country);
  }
  /**
     * @description Creates a new country in the database if it does not exist
     * @param {string} name The country's name
     * @returns {object} The new country's data values
     */
  async createCountry(name: string): Promise<object> {
    const [country, isNewCountry] = await this.model.findOrCreate({
      where: { name: { [Op.iLike]: `${name.trim()}%` } },
      defaults: { name },
    });

    return {
      isNewCountry,
      country: country.get(),
    };
  }

  /**
     * @description Finds a country by the country name
     * @param {string} name The country's name
     * @param {number} id The country's id
     * @returns {object} The new country's data values
     */
  async findCountry(name: string, id: number = -1): Promise<object> {
    const country = await this.model.findOne({
      where: { [Op.or]: [{ id }, { name: { [Op.iLike]: `${name.trim()}` } }] },
      raw: true,
    });
    return country;
  }

  /**
     * @description Returns a list of countries
     * @param {number} size The number of countries you want to return
     * @param {number}  page The page number
     * @param {string} name The name of the country
     * @returns {object} A list of all countries in the database
     */
  async getAllCountries(size: number,
    page: number, name: string): Promise<object> {
    const { data } = await this.getPaginated({
      page,
      limit: size,
      defaultOptions: {
        where: { name: { [Op.iLike]: `${name}%` } },
        order: [['id', 'ASC']],
      },
    });
    return {
      rows: data,
      count: data.length,
    };
  }

  /**
     * @description Finds a country by the id
     * @param {number} id the country's id in the database
     * @returns {object} The country's data
     */
  async getCountryById(id: number) {
    const country = await this.findById(id);
    return country;
  }

  /**
     * @description Updates a country's name by id
     * @param {number} id the country's id in the database
     * @param {object} name the country's name
     * @returns {object} The updated country's data
     */
  async updateCountryName(id: number, name: string): Promise<object> {
    try {
      const country = await this.findById(id);

      if (!country) return { message: 'Country does not exist' };

      const updatedCountry = await this.update(id, { name });
      return updatedCountry;
    } catch (error) {
      return { message: 'Country name already exists' };
    }
  }

  /**
     * @description deletes a country's name by id or name
     * @param {number} id the country's id in the database
     * @param {object} name the country's name
     * @returns {object} The updated country's data
     */
  async deleteCountryByNameOrId(id: number = -1,
    name: string = ''): Promise<Boolean> {
    const country = await this.model.findOne({
      where: { [Op.or]: [{ id }, { name: { [Op.iLike]: `${name}` } }] },
      raw: true,
    });
    HttpError.throwErrorIfNull(country, 'Country provided was not found', 404);
    await this.update(country.id, { status: 'Inactive' });
    return true;
  }

  /**
   * @description deletes a country's name by id or name
   * @param {string} name the country's name
   * @param {string} status the country's status
   * @returns {object} The country's data
   */
  async findDeletedCountry(name = '', status = 'Inactive') {
    const country = await Country.scope('all').findOne({
      where: {
        [Op.and]: [
          { status },
          { name: name.trim() },
        ],
      },
    });
    return country;
  }

  /**
   * @description finds if a  country is listed globally
   * @param {string} name the country's name
   * @returns {any} The country's data or an error object
   */
  async findIfCountryIsListedGlobally(name: string) {
    const uri = `https://restcountries.eu/rest/v2/name/${name}`;
    try {
      const countryData = await request.get(uri);
      return countryData;
    } catch (error) {
      return error;
    }
  }
}

export const countryService = new CountryService();
export default CountryService;
