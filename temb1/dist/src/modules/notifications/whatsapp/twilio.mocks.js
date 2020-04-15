"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twlioMockResponses = {
    success: (phone) => ({
        accountSid: 'ACed17976518e75da3fd4836180357e024',
        apiVersion: '2010-04-01',
        body: 'Hi, welcome to Tembea Whatsapp Service',
        dateCreated: '2019-09-03T15:15:24.000Z',
        dateUpdated: '2019-09-03T15:15:24.000Z',
        dateSent: '',
        direction: 'outbound-api',
        errorCode: '',
        errorMessage: '',
        from: 'whatsapp:+14155238886',
        messagingServiceSid: '',
        numMedia: '0',
        numSegments: '1',
        price: '',
        priceUnit: '',
        sid: 'SMdc3ec5c7a8414174a9acf46041b3f533',
        status: 'queued',
        subresourceUris: {
            media: '/2010-04-01/Accounts/ACed17976518e75da3fd4836180357e024/Messages/SMdc3ec5c7a8414174a9acf46041b3f533/Media.json',
        },
        to: `whatsapp:${phone}`,
        uri: '/2010-04-01/Accounts/ACed17976518e75da3fd4836180357e024/Messages/SMdc3ec5c7a8414174a9acf46041b3f533.json',
    }),
    wrongNumber: (phone) => ({
        status: 400,
        message: `The 'To' number whatsapp:${phone} is not a valid phone number.`,
        code: 21211,
        moreInfo: 'https://www.twilio.com/docs/errors/21211',
        detail: '',
    }),
    invalidTwilioParams: {
        status: 401,
        message: 'Authentication Error - invalid username',
        code: 20003,
        moreInfo: 'https://www.twilio.com/docs/errors/20003',
        detail: 'Your AccountSid or AuthToken was incorrect.',
    },
};
exports.mockTwilioClient = {
    create: (opts, callback) => Promise.resolve({}),
};
exports.mockWhatsappOptions = () => jest.mock('./whatsapp.service.ts', () => ({
    getWhatsappOptions: () => ({
        twilioOptions: {},
        defaultSender: 'hello',
    }),
}));
//# sourceMappingURL=twilio.mocks.js.map