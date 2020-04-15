import { mockTwilioClient, mockWhatsappOptions } from './twilio.mocks';
import { IWhatsappOptions, WhatsappService, IWhatsappMessage } from './whatsapp.service';

describe('WhatsappService', () => {
  let options: IWhatsappOptions;
  let whatsapp: WhatsappService;

  beforeAll(() => {
    options = {
      defaultSender: '+2341112333',
      twilioOptions: {
        accountSid: 'AC123',
        authToken: 'token',
      },
    } ;
    whatsapp = new WhatsappService(mockTwilioClient, options.defaultSender);
  });

  it('should be defined', () => {
    expect(whatsapp).toBeDefined();
  });

  describe('send', () => {
    it('should send a message to specified number', async () => {
      const phone = '+2348027555908';
      const message = 'Hi, welcome to Tembea Whatsapp Service';
      const msg: IWhatsappMessage = {
        to: phone,
        body: message,
      };

      const result = await whatsapp.send(msg);

      expect(result).toBeTruthy();
    });
  });
});
