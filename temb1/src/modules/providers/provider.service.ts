import database, {
  User, Cab, Driver, Provider
} from '../../database';
import ProviderHelper from '../../helpers/providerHelper';
import { BaseService } from '../shared/base.service';
import RemoveDataValues from '../../helpers/removeDataValues';
import { DirectMessage } from './notifications/dm.notification';
import { EmailNotification } from './notifications/email.notification';
import { ChannelNotification } from './notifications/channel.notification';
import { WhatsAppNotification } from './notifications/whatsapp.notfication';
import { ProviderNotificationChannel } from '../../database/models/provider';
import { homebaseInfo } from '../routes/route.service';
import { IProvider } from './notifications/notification.interface';

class ProviderService extends BaseService<Provider, number> {
  constructor(model = database.getRepository(Provider)) {
    super(model);
  }

  /**
   * @description Returns a list of providers from db
   * page and size variables can also be passed on the url
   * @param {{ page:number, size:number }} pageable
   * @param where {object}
   * @returns {object} An array of providers
   * @example ProviderService.getAllProvidersByPage(
   *  { page:1, size:20 }
   * );
   */
  async getProviders(pageable = ProviderHelper.defaultPageable, where = {}, homebaseId: number) {
    const include = [{
      model: User,
      as: 'user',
      attributes: ['name', 'phoneNo', 'email', 'slackId'],
    },
    { ...homebaseInfo },
    ];
    const {
      pageMeta: {
        totalPages, limit, count, page
      }, data
    } = await this.getPaginated({
      page: pageable.page,
      limit: pageable.size,
      defaultOptions: { include, where: { ...where, homebaseId } },
    });
    return {
      data,
      pageMeta: {
        totalPages,
        pageNo: page,
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * @description Update provider details
   * @returns {object} update provider details
   * @example ProviderService.updateProvider(
   *  {object},1);
   * @param updateObject
   * @param providerId
   */
  async updateProvider(updateObject: object, providerId: number): Promise<object> {
    const oldProviderDetails = await this.findById(providerId);
    if (!oldProviderDetails) return { message: 'Update Failed. Provider does not exist' };
    const updatedProviderDetails = await this.update(providerId, { ...updateObject });
    return updatedProviderDetails;
  }

  /**
   *@description Deletes provider details
    * @param id
    * @returns {Promise<*>}
    */
  async deleteProvider(id: number): Promise <number> {
    const responseData = await this.model.destroy({
      where: { id },
    });
    return responseData;
  }

  /**
   *@description Adds a provider
    * @param {object} providerData - The Provider data
    * @returns {object }
    */
  async createProvider(providerData: object): Promise <object> {
    const provider = await this.add(providerData);
    return provider;
  }

  async findByPk(pk: number, withFks = false): Promise <object> {
    const provider = await this.findById(pk, withFks ? ['user'] : []);
    return provider;
  }

  /**
   * Find a specific provider by a given user id (owner)
   *
   * @param {number} providerUserId - The provider's owner id
   * @returns {object} The model instance
   * @memberof ProviderService
   */
  async findProviderByUserId(providerUserId: number): Promise <object> {
    const provider = await this.findOneByProp({ prop: 'providerUserId', value: providerUserId });
    return provider;
  }

  /**
   * Get a specific provider by id
   *
   * @static
   * @param {number} id - The provider's unique identifier
   * @returns {object} The provider object
   * @memberof ProviderService
   */
  async getProviderById(id: number): Promise <Provider> {
    const provider = await this.findById(id);
    return provider;
  }

  async getViableProviders(homebaseId: number): Promise<Provider[]> {
    const providers = await this.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{
        model: Cab,
        as: 'vehicles',
      }, {
        model: Driver,
        as: 'drivers',
      }, {
        model: User,
        as: 'user',
        attributes: ['name', 'phoneNo', 'email', 'slackId'],
      }],
      where: {
        homebaseId,
      },
    });
    return providers.filter(
      (provider: Provider) => {
        const p = provider;
        return p.vehicles.length > 0 && p.drivers.length > 0;
      },
    );
  }

  /**
   * @description Returns a user and its provider detail of the specified slackId
   * @param slackId {string}
   * @returns {object} the user details
   */
  async getProviderBySlackId(slackId: string): Promise <Provider> {
    const user = await this.model.findOne({
      include: [{
        model: User,
        where: { slackId },
        as: 'user',
        attributes: ['slackId', 'id', 'email'],
      }],
    });
    return RemoveDataValues.removeDataValues(user);
  }

  /**
   * @description Returns a user and its provider detail of the specified userId
   * @param id {number} the user id
   * @returns {object} the user details
   */
  async getProviderByUserId(id: number): Promise <Provider> {
    const user = await this.model.findOne({
      include: [{
        model: User,
        where: { id },
        as: 'user',
        attributes: ['slackId'],
      }],
    });
    return RemoveDataValues.removeDataValues(user);
  }

  /**
   * @param provider {object}
   * @param tripInfo {object}
   * @param teamDetail {object}
   */
  async notifyTripRequest(
    provider: IProvider, teamDetail: object, tripInfo: object,
  ): Promise<void> {
    await this.getNotifier(provider.notificationChannel)
      .notifyNewTripRequest(provider, tripInfo, teamDetail);
  }

  async verify(provider: IProvider, options: object): Promise<void> {
    await this.getNotifier(provider.notificationChannel)
      .sendVerificationMessage(provider, options);
  }

  getNotifier(channel: string) {
    switch (channel) {
      case ProviderNotificationChannel.directMessage:
        // Direct message
        return new DirectMessage();
      case ProviderNotificationChannel.email:
        // email
        return new EmailNotification();
      case ProviderNotificationChannel.channel:
      // notify provider via his private channel
        return new ChannelNotification();
      case ProviderNotificationChannel.whatsapp:
      // notify provider via his whatsapp
        return new WhatsAppNotification();
      default:
        throw new Error('not implemented notification channel');
    }
  }

  /** @description Returns a user and its provider detail of the specified userId
    * @param id {number} the user id
    * @returns {object} the user details
    */
  async activateProviderById(updateObject: object, providerId: number): Promise <object> {
    try {
      const provider = await this.update(providerId, { ...updateObject });
      return provider;
    } catch (err) {
      const error = new Error('specified provider does not exist');
      error.name = 'ProviderUpdateError';
      throw error;
    }
  }

  isDmOrChannel(channel: string) {
    return channel === ProviderNotificationChannel.directMessage
      || channel === ProviderNotificationChannel.channel;
  }
}

export const providerService = new ProviderService();
export default ProviderService;
