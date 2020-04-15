import { TokenValidator } from '../TokenValidator';


describe(TokenValidator, () => {
  let tokenValidator = new TokenValidator();
  let responseMock;
  let utilsMock;

  beforeEach(() => {
    responseMock = {
      sendResponse: jest.fn(),
    };
    utilsMock = {
      verifyToken: jest.fn()
    };
    tokenValidator = new TokenValidator(utilsMock, responseMock);
  });

  describe('Authenticate token method', () => {
    let nextMock;

    beforeEach(() => {
      nextMock = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call sendResponse function with No token provided message', async () => {
      const req = { headers: {}, envSecretKey: 'secret' };

      await tokenValidator.authenticateToken(req, 'res', nextMock);
      expect(responseMock.sendResponse).toHaveBeenCalledTimes(1);
      expect(responseMock.sendResponse).toHaveBeenCalledWith('res', 401, false, 'No token provided');
      expect(nextMock).toHaveBeenCalledTimes(0);
    });

    it('should decode token and call next method', async () => {
      const req = { headers: { authorization: 'token' }, envSecretKey: 'secret' };
      jest.spyOn(utilsMock, 'verifyToken').mockReturnValue('decoded');

      await tokenValidator.authenticateToken(req, 'res', nextMock);
      expect(responseMock.sendResponse).toHaveBeenCalledTimes(0);
      expect(utilsMock.verifyToken).toHaveBeenCalledTimes(1);
      expect(utilsMock.verifyToken).toHaveBeenCalledWith('token', 'secret');
      expect(req.currentUser).toEqual('decoded');
      expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error and call sendResponse function with authentication failed message', async () => {
      const req = { headers: { authorization: 'token' }, envSecretKey: 'secret' };
      const errMock = new Error('Fail');
      jest.spyOn(utilsMock, 'verifyToken').mockImplementationOnce(() => { throw errMock; });

      await tokenValidator.authenticateToken(req, 'res', nextMock);

      expect(utilsMock.verifyToken).toHaveBeenCalledTimes(1);
      expect(utilsMock.verifyToken).toHaveBeenCalledWith('token', 'secret');
      expect(nextMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Validate Role method', () => {
    let nextMock;

    beforeEach(() => {
      nextMock = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call sendResponse method with Unauthorized message', async () => {
      const reqMock = { currentUser: { userInfo: { roles: ['Admin'] } } };
      await tokenValidator.validateRole(reqMock, 'res', nextMock);

      expect(responseMock.sendResponse).toHaveBeenCalledTimes(1);
      expect(responseMock.sendResponse).toHaveBeenCalledWith('res', 401, false,
        'Unauthorized access');
      expect(nextMock).toHaveBeenCalledTimes(0);
    });

    it('should call next method', async () => {
      const reqMock = { currentUser: { userInfo: { roles: ['Super Admin'] } } };
      await tokenValidator.validateRole(reqMock, 'res', nextMock);

      expect(responseMock.sendResponse).toHaveBeenCalledTimes(0);
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('attachJWTSecretKey method', () => {
    let nextMock;

    beforeEach(() => {
      nextMock = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should attach andelaJWTKey to req object and call next method', async () => {
      const reqMock = { path: '/auth/verify' };
      await tokenValidator.attachJwtSecretKey(reqMock, 'res', nextMock);

      expect(reqMock.envSecretKey).toEqual('JWT_ANDELA_KEY');
      expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should attach andelaJWTKey to req object and call next method', async () => {
      const reqMock = { path: '/user' };
      await tokenValidator.attachJwtSecretKey(reqMock, 'res', nextMock);

      expect(reqMock.envSecretKey).toEqual('TEMBEA_PUBLIC_KEY');
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });
});
