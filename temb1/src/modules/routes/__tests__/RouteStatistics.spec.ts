import { routeStatistics } from '../../routes/route-statistics.service';
import riderStats from '../__mocks__/routeRiderStatistics';
import aisService from '../../../services/AISService';
import database from '../../../database';

const { models: { BatchUseRecord } } = database;

describe('routeStatistics - getFrequentRiders', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should return an object of rider statistics ', async () => {
    jest.spyOn(BatchUseRecord, 'findAll').mockResolvedValue(riderStats);
    const data = await routeStatistics.getFrequentRiders('DESC', '2018-01-01', '2019-12-11', 1);
    expect(BatchUseRecord.findAll).toBeCalled();
    expect(data).toEqual(riderStats.map((e) => e.get({ plain: true })));
  });

  it('should return an error in catch block', async () => {
    jest.spyOn(BatchUseRecord, 'findAll').mockRejectedValue(Error('some error'));
    const data = await routeStatistics.getFrequentRiders('DESC', '2018-01-01', '2019-12-11', 1);
    expect(data).toBe('some error');
  });
});

describe('routeStatistics - getTopAndLeastFrequentRiders', () => {
  let mockedFunction: any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockedFunction = jest.spyOn(routeStatistics, 'getFrequentRiders');
  });

  it('should call getFrequentRiders twice', async () => {
    jest.spyOn(routeStatistics, 'addUserPictures').mockImplementation(() => jest.fn());
    await routeStatistics.getTopAndLeastFrequentRiders('2018-01-01', '2019-12-31', 1);
    expect(mockedFunction).toBeCalledTimes(2);
  });

  it('should return top and least frequent riders', async () => {
    jest.spyOn(routeStatistics, 'getFrequentRiders').mockResolvedValue(riderStats);
    jest.spyOn(routeStatistics, 'addUserPictures').mockResolvedValue(riderStats);
    const mockedResult = {
      firstFiveMostFrequentRiders: riderStats,
      leastFiveFrequentRiders: riderStats,
    };
    const result = await routeStatistics.getTopAndLeastFrequentRiders(
      '2018-01-01', '2019-12-31', 1,
    );

    expect(result).toStrictEqual(mockedResult);
  });

  it('should return an error in catch block', async () => {
    mockedFunction.mockResolvedValue(Promise.reject(new Error('some error')));

    const data = await routeStatistics.getTopAndLeastFrequentRiders('2018-01-01', '2019-12-31', 1);

    expect(data).toBe('some error');
  });
});

describe('routeStatistics - getUserPicture', () => {
  const mockedData = 'https://lh6.googleusercontent.com/-jBtpXcQOrXs/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rcsm2s5f9G9LxqmJ4EX9JZDM7NFzA/s50/photo.jpg';
  let mockAISService: any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockAISService = jest.spyOn(aisService, 'getUserDetails');
  });

  it('should return a link to the profile picture', async () => {
    mockAISService.mockResolvedValue({ picture: mockedData });
    const url = await routeStatistics.getUserPicture('mosinmiloluwa.owoso@andela.com');

    expect(url).toEqual(mockedData);
  });

  it('should return a default profile picture', async () => {
    mockAISService.mockResolvedValue({ picture: '' });
    const url = await routeStatistics.getUserPicture('johnxeyz@andela.com');

    expect(url).toEqual(
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    );
  });
});

describe('routeStatistics - addUserPictures', () => {
  let mockAddUserPictures: any;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockAddUserPictures = jest.spyOn(routeStatistics, 'addUserPictures');
  });

  it('should add profile picture in the object returned', async () => {
    const d: object[] = riderStats.map((e) => e.get({ plain: true }));
    mockAddUserPictures.mockResolvedValue(d);

    const data: any = await routeStatistics.addUserPictures(d);
    expect(data[0]).toHaveProperty('picture');
  });
});
