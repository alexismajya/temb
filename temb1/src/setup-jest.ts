import database, {
  User,
  Homebase,
  Department,
  Provider,
  Cab,
  Driver,
  TeamDetails,
  Address,
  TripRequest,
} from './database';
import faker from 'faker';
import { TripStatus, TripTypes } from './database/models/trip-request';
import { ProviderNotificationChannel } from './database/models/provider';

export interface ITestData {
  homebase: Homebase;
  users: User[];
  department: Department;
  provider: Provider;
  cab: Cab;
  driver: Driver;
  team: TeamDetails;
  addresses: Address[];
  trips: TripRequest[];
}

const testStartupCollections = {} as ITestData;

const createTestUsers = async () => {
  const userRepo = database.getRepository(User);
  testStartupCollections.homebase = await database.getRepository(Homebase).findOne();
  const usersList = [];
  for (let i = 0; i < 10; i += 1) {
    usersList.push({
      name: faker.fake('{{name.lastName}}, {{name.firstName}}'),
      slackId: faker.random.alphaNumeric(6).toLocaleUpperCase(),
      phoneNo: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      homebaseId: testStartupCollections.homebase.id,
    });
  }

  testStartupCollections.users = await userRepo.bulkCreate(usersList);
};

const createTeam = async () => {
  const teamRepo = database.getRepository(TeamDetails);
  const team = {
    teamId: faker.random.alphaNumeric(9).toLocaleUpperCase(),
    botId: faker.random.alphaNumeric(9).toLocaleUpperCase(),
    botToken: faker.random.alphaNumeric(15),
    teamName: faker.company.companyName(),
    teamUrl: faker.internet.url(),
    webhookConfigUrl: faker.internet.url(),
    userId: faker.random.alphaNumeric(9).toLocaleUpperCase(),
    userToken: faker.random.alphaNumeric(9).toLocaleUpperCase(),
    opsChannelId: faker.random.alphaNumeric(9).toLocaleUpperCase(),
  };
  testStartupCollections.team = await teamRepo.create(team);
};

const createAddresses = async () => {
  testStartupCollections.addresses = await database.getRepository(Address).findAll();
};

const createTestDepartments = async () => {
  // const testUserIds = JSON.parse(process.env.TEST_USERS) as number[];
  const departmentRepo = database.getRepository(Department);
  const department = {
    name: faker.lorem.words(1),
    teamId: testStartupCollections.team.teamId,
    headId: testStartupCollections.users[3].id,
    homebaseId: testStartupCollections.homebase.id,
  };

  testStartupCollections.department = await departmentRepo.create(department);
};

const createTestProviders = async () => {
  const providerRepo = database.getRepository(Provider);
  const provider = {
    name: faker.company.companyName(),
    homebaseId: testStartupCollections.homebase.id,
    providerUserId: testStartupCollections.users[4].id,
    notificationChannel: ProviderNotificationChannel.directMessage,
    email: testStartupCollections.users[4].email,
    phoneNo: faker.internet.email(),
  };

  testStartupCollections.provider = await providerRepo.create(provider);
};

const createTestCabsAndDrivers = async () => {
  const driverRepo = database.getRepository(Driver);
  const cabRepo = database.getRepository(Cab);
  const driver = {
    driverName: faker.name.findName(),
    driverPhoneNo: faker.random.number(),
    driverNumber: faker.random.number(),
    providerId: testStartupCollections.provider.id,
    userId: testStartupCollections.users[1].id,
  };
  const cab = {
    regNumber: faker.random.alphaNumeric(6).toLocaleUpperCase(),
    capacity: faker.random.number(),
    model: faker.random.alphaNumeric(6).toLocaleUpperCase(),
    providerId: testStartupCollections.provider.id,
  };

  testStartupCollections.driver = await driverRepo.create(driver);
  testStartupCollections.cab = await cabRepo.create(cab);
};

const createTestTrips = async () => {
  const tripRepo = database.getRepository(TripRequest);
  const tripList = [];
  const tripDepartureTime = new Date(new Date().getTime() - 864000000).toISOString();

  for (let i = 0; i < 5; i += 1) {
    tripList.push({
      destinationId: testStartupCollections.addresses[i].id,
      riderId: testStartupCollections.users[i].id,
      name: faker.lorem.words(2),
      reason: faker.lorem.words(3),
      departmentId: testStartupCollections.department.id,
      tripStatus: TripStatus.pending,
      departureTime: tripDepartureTime,
      requestedById: testStartupCollections.users[i].id,
      originId: testStartupCollections.addresses[i].id,
      noOfPassengers: faker.random.number(),
      tripType: TripTypes.regular,
    });
  }
  testStartupCollections.trips = await tripRepo.bulkCreate(tripList);
};

const setupJest = async () => {
  process.env.TEMBEA_TWILIO_SID = 'ACesgvajhvavjhvashavh';
  process.env.TEMBEA_TWILIO_TOKEN = '1sahbjduihwqb2782his7q';

  await createTestUsers();
  await createTeam();
  await createAddresses();
  await createTestDepartments();
  await createTestProviders();
  await createTestCabsAndDrivers();
  await createTestTrips();

  process.env.TEST_DATA = JSON.stringify(testStartupCollections);
};

export default setupJest;
