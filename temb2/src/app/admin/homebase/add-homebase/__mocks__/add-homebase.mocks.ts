export const homebaseResponseMocks = {
  success: true,
  message: 'Homebase created successfully',
  homebase: {
    id: 1,
    homebaseName: 'Taxify Kenya',
    channel: 'kakkakak',
    countryId: 1,
    address: {
      address: 'kigali arena',
      location: { latitude: -30, longitute: 30 }
    },
    currency: 'RWF',
    optEmail: null,
    travelEmail: null,
    updatedAt: '2019-04-14T10:22:01.291Z',
    createdAt: '2019-04-14T10:22:01.291Z',
  }
};

export const mockCoordinates = {
  lat: -30,
  lng: 30
};
