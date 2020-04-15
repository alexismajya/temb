import { Interactions } from '../interactions';
import { dependencyMocks, payload, tripPayload, cachedObject, isEditTrue } from '../__mocks__';

const {
  addressServiceMock,
  departmentServiceMock,
  teamDetailsServiceMock,
  getSlackViewsMock,
  homebaseServiceMock,
  newSlackHelpersMock,
} = dependencyMocks;

describe(Interactions, () => {
  let interactions: Interactions;

  beforeEach(() => {
    interactions = new Interactions(addressServiceMock, departmentServiceMock,
      teamDetailsServiceMock, getSlackViewsMock, homebaseServiceMock, newSlackHelpersMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Interactions.sendContactDetailsModal', () => {
    it('should send contact details modal', async (done) => {
      const didOpen = await interactions.sendContactDetailsModal(payload);
      expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
      expect(didOpen).toBe(true);
      done();
    });
    it('should send contact details modal when isEdit', async (done) => {
      const didOpen = await interactions.sendContactDetailsModal(
        payload, cachedObject, isEditTrue,
      );
      expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
      expect(didOpen).toBe(true);
      done();
    });
  });

  describe(Interactions.prototype.getContactDetailsModal, () => {
    it('should get embassy visit', async (done) => {
      const contactDetailsModal = await interactions.getContactDetailsModal(payload);
      expect(contactDetailsModal).toBeDefined();
      done();
    });
  });

  describe(Interactions.prototype.sendAddNoteModal, () => {
    it('should send add note modal', async (done) => {
      const didOpen = await interactions.sendAddNoteModal(payload);
      expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
      expect(didOpen).toBe(true);
      done();
    });
  });

  describe('Interactions.getAddNoteModal', () => {
    it('should get add note modal', async (done) => {
      const addNoteModal = await interactions.getAddNoteModal(payload);
      expect(addNoteModal).toBeDefined();
      done();
    });
  });

  describe('Interactions.sendLocationModal', () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        view: {
          private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
        },
      };
    });
    it('should send location modal', async (done) => {
      const didOpen = await interactions.sendLocationModal(newPayload, tripPayload);
      expect(homebaseServiceMock.getHomeBaseEmbassies).toHaveBeenCalledTimes(1);
      expect(homebaseServiceMock.getHomeBaseBySlackId).toHaveBeenCalledTimes(1);
      expect(addressServiceMock.getAddressListByHomebase).toHaveBeenCalledTimes(1);
      expect(teamDetailsServiceMock.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
      expect(didOpen).toBe(true);
      done();
    });
  });

  describe(Interactions.prototype.getLocationModal, () => {
    let newPayload: any;
    beforeAll(() => {
      newPayload = {
        ...payload,
        view: {
          private_metadata: JSON.stringify('https://hooks.slack.com/actions/TNZ9397ST/866771506832/PkqOPLH7Wpb2OB5ENpgJPLVT'),
        },
      };
    });
    it('should get localtion modal', async (done) => {
      const locationModal = await interactions.getLocationModal(newPayload, tripPayload);
      expect(locationModal).toBeDefined();
      done();
    });
  });
});
