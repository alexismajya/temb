import { IProviderNotification, IProvider } from './notification.interface';
import { phoneNoRegex } from '../../../middlewares/validationSchemasExetension';
import { BaseNotification } from './base.notification';
import whatsappService from '../../../modules/notifications/whatsapp/whatsapp.service';

export class WhatsAppNotification extends BaseNotification implements IProviderNotification {
  constructor(private readonly whatsapp = whatsappService) {
    super();
  }

  notifyNewTripRequest(provider: IProvider, tripDetails: any,
    teamDetails: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async sendVerificationMessage(provider: IProvider, options: any): Promise<void> {
    if (phoneNoRegex.test(provider.phoneNo)) {
      const message = {
        body: `Hello *${provider.name}* \n Click on this link to activate your account: \n ${options.origin}/provider/${this.generateToken({ id: provider.id })}`,
        to: `${provider.phoneNo}`,
      };

      await this.whatsapp.send(message);
    }
  }
}
