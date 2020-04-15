export const providerConfirmMock = {
  message: 'Confirmation received',
  payload: {
    providerId: 7,
    driverName: 'Test Driver',
    driverPhoneNo: '+23481989388390',
    vehicleModel: 'Avensisz',
    vehicleRegNo: 'LSK-23-HJS'
  }
};

export class MockError extends Error {
  error: any;
  constructor(public status: number, public message: string) {
    super(message);
    this.error = {
        message
    };
  }
}
