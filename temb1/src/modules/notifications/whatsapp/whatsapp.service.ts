import twilio from 'twilio';
import { MessageListInstance } from 'twilio/lib/rest/api/v2010/account/message';

export interface ITwilioOptions {
  accountSid: string;
  authToken: string;
}

export interface IWhatsappOptions {
  twilioOptions: ITwilioOptions;
  defaultSender: string;
}

export interface IWhatsappMessage {
  body: string;
  to: string;
}

export class WhatsappService {
  private readonly twilioNumberPrefix: string;
  private readonly sender: string;

  constructor(
    private readonly twilioClient: MessageListInstance,
    defaultSender: string) {
    this.twilioNumberPrefix = 'whatsapp:';
    this.sender = `${this.twilioNumberPrefix}${defaultSender}`;
  }

  async send(message: IWhatsappMessage) {
    if (this.validateMessage(message)) {
      try {
        const result = await this.twilioClient.create({
          body: message.body,
          from: this.sender,
          to: `${this.twilioNumberPrefix}${message.to}`,
        });
        return true;
      } catch (err) {
        // TODO: implement retry logic
      }
    }
  }

  private validateMessage(message: IWhatsappMessage) {
    if (message && message.body !== null && message.to != null) return true;
  }
}

const getTwilioOptions = (): ITwilioOptions => ({
  accountSid: process.env.TEMBEA_TWILIO_SID,
  authToken: process.env.TEMBEA_TWILIO_TOKEN,
});

const getWhatsappOptions = (): IWhatsappOptions => ({
  twilioOptions: getTwilioOptions(),
  defaultSender: process.env.TEMBEA_TWILIO_SENDER,
});

const getTwilioClient = (options: ITwilioOptions) : MessageListInstance => {
  return twilio(options.accountSid, options.authToken).messages;
};

const whatsappOptions = getWhatsappOptions();
const twilioClient = getTwilioClient(whatsappOptions.twilioOptions);
const whatsappService = new WhatsappService(twilioClient, whatsappOptions.defaultSender);

export default whatsappService;
