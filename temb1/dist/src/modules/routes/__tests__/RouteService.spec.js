"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_service_1 = require("../route.service");
const database_1 = __importStar(require("../../../database"));
const errorHandler_1 = __importDefault(require("../../../helpers/errorHandler"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const __mocks__1 = require("../../../services/__mocks__");
const RouteServiceHelper_1 = __importDefault(require("../../../helpers/RouteServiceHelper"));
const routeBatch_service_1 = require("../../routeBatches/routeBatch.service");
const { models: { Route, RouteBatch, Cab, Address, User, }, } = database_1.default;
describe('RouteService', () => {
    const { route } = __mocks__1.mockRouteBatchData, batchDetails = __rest(__mocks__1.mockRouteBatchData, ["route"]);
    const firstRoute = {
        route: {
            id: 12,
            name: 'c',
            destinationid: 1,
            routeBatch: [{ batch: 'C' }],
            riders: [{}, {}, {}, {}],
            capacity: 4,
        },
    };
    const routeCreationResult = {
        cabDetails: {
            id: 1, capacity: 4, regNumber: 'CCCCCC', model: 'saburu',
        },
        route: {
            name: 'ZZZZZZ',
            imageUrl: 'https://image-url',
            destination: { id: 456, address: 'BBBBBB' },
            routeBatch: [{ batch: 'A' }],
        },
        riders: [],
        inUse: 1,
        batch: 'A',
        capacity: 1,
        takeOff: 'DD:DD',
        comments: 'EEEEEE',
        imageUrl: 'https://image-url',
        status: 'Active',
    };
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    afterAll((done) => database_1.default.close().then(done));
    describe('RouteService_createRouteBatch', () => {
        beforeEach(() => {
            jest.spyOn(routeBatch_service_1.routeBatchService, 'createRouteBatch').mockResolvedValue(routeCreationResult);
            jest.spyOn(route_service_1.routeService, 'updateBatchLabel').mockResolvedValue('B');
            jest.spyOn(route_service_1.routeService, 'getRouteById').mockResolvedValue(route);
            jest.spyOn(route_service_1.routeService, 'findById').mockResolvedValue({ route, created: true });
        });
        it('should create initial route batch', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(Route, 'findByPk').mockResolvedValue(__mocks__1.routeMock[0]);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'createRouteBatch')
                .mockImplementationOnce(() => (routeCreationResult));
            const result = yield route_service_1.routeService.createRouteBatch(__mocks__1.routeMock[0].get({ plain: true }), '');
            expect(result).toEqual(routeCreationResult);
            expect(route_service_1.routeService.updateBatchLabel).toHaveBeenCalled();
        }));
    });
    describe('RouteService_createRoute', () => {
        beforeEach(() => {
            const created = true;
            const routeDetails = { dataValues: Object.assign({}, route) };
            jest.spyOn(Route, 'findOrCreate').mockResolvedValue([routeDetails, created]);
        });
        it('should return created route details', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = 'yaba';
            const imageUrl = 'imageUrl';
            jest.spyOn(Route, 'findOrCreate').mockResolvedValue([__mocks__1.routeMock[1], true]);
            const result = yield route_service_1.routeService.createRoute({ name, imageUrl, destinationId: __mocks__1.mockRouteBatchData.route.destination.id });
            expect(result).toEqual({ route: __mocks__1.routeMock[1].get(), created: true });
            expect(Route.findOrCreate).toBeCalled();
            const calledWith = Route.findOrCreate.mock.calls[0][0];
            expect(calledWith).toHaveProperty('where');
            expect(calledWith).toHaveProperty('defaults');
        }));
    });
    describe('RouteService_addUserToRoute', () => {
        beforeEach(() => {
            jest.spyOn(errorHandler_1.default, 'throwErrorIfNull');
            jest.spyOn(user_service_1.default, 'getUserById');
            jest.spyOn(RouteBatch, 'findByPk');
            jest.spyOn(RouteServiceHelper_1.default, 'canJoinRoute');
            jest.spyOn(database_1.default, 'transaction').mockImplementation((fn) => {
                fn();
            });
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it("should throw an error if route doesn't exists", () => __awaiter(void 0, void 0, void 0, function* () {
            RouteBatch.findByPk.mockResolvedValue(null);
            const userId = 2;
            const routeBatchId = 2;
            try {
                yield route_service_1.routeService.addUserToRoute(routeBatchId, userId);
            }
            catch (e) {
                expect(e.statusCode).toEqual(404);
                expect(RouteServiceHelper_1.default.canJoinRoute).not.toHaveBeenCalled();
                expect(errorHandler_1.default.throwErrorIfNull.mock.calls[0][1]).toEqual('Route route not found');
            }
        }));
        it('should add a user to the route', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = 3;
            const routeBatchId = 3;
            const mockRoute = Object.assign(Object.assign({}, __mocks__1.mockRouteBatchData), { id: routeBatchId, capacity: 2, inUse: 1 });
            const user = { id: 1 };
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getById').mockImplementationOnce(() => (mockRoute));
            jest.spyOn(user_service_1.default, 'getUserById').mockImplementationOnce(() => Promise.resolve(user));
            jest.spyOn(user_service_1.default, 'updateUser').mockReturnValueOnce(null);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'updateRouteBatch')
                .mockImplementationOnce(() => Promise.resolve({
                inUse: mockRoute.inUse + 1,
            }));
            yield route_service_1.routeService.addUserToRoute(routeBatchId, userId);
            expect(user_service_1.default.getUserById).toBeCalled();
            expect(database_1.default.transaction).toHaveBeenCalled();
            expect(user_service_1.default.updateUser).toHaveBeenCalled();
            expect(routeBatch_service_1.routeBatchService.updateRouteBatch).toHaveBeenCalledWith(userId, {
                inUse: mockRoute.inUse + 1,
            });
        }));
        it('should throw an error if route is filled to capacity', () => __awaiter(void 0, void 0, void 0, function* () {
            RouteBatch.findByPk.mockResolvedValue(__mocks__1.mockRouteBatchData);
            const userId = 2;
            const routeBatchId = 2;
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getById').mockImplementationOnce(() => ({}));
            try {
                yield route_service_1.routeService.addUserToRoute(routeBatchId, userId);
            }
            catch (e) {
                expect(e.statusCode).toEqual(403);
                expect(RouteServiceHelper_1.default.canJoinRoute).toHaveBeenCalled();
                expect(errorHandler_1.default.throwErrorIfNull.mock.calls[1][2]).toEqual(403);
                expect(errorHandler_1.default.throwErrorIfNull.mock.calls[1][1]).toEqual('Route capacity has been exhausted');
            }
        }));
    });
    describe('RouteService_getRoute', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            jest.restoreAllMocks();
        });
        it('should get a route by Id ', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 123;
            const mock = {
                get: ({ plain }) => (plain ? Object.assign(Object.assign({}, __mocks__1.mockRouteBatchData), { id }) : null),
            };
            const findByPk = jest.spyOn(Route, 'findByPk').mockReturnValue(mock);
            const result = yield route_service_1.routeService.getRouteById(id, true);
            expect(findByPk).toHaveBeenCalled();
            expect(result).toEqual(mock.get({ plain: true }));
        }));
    });
    describe('RouteService_getRouteByName', () => {
        it('should return route details from the db', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRouteDetails = { id: 1, name: 'Yaba', imgUrl: 'images://an-img.png' };
            jest.spyOn(route_service_1.routeService, 'findOneByProp').mockResolvedValue(mockRouteDetails);
            const routeDetails = yield route_service_1.routeService.getRouteByName('Yaba');
            expect(routeDetails).toEqual(mockRouteDetails);
        }));
    });
    describe('RouteService_serializeData', () => {
        it('should combine all route info into one object', () => {
            const res = RouteServiceHelper_1.default.serializeRouteBatch(__mocks__1.mockRouteBatchData);
            expect(res).toHaveProperty('capacity');
            expect(res).toHaveProperty('driverPhoneNo');
            expect(res).toHaveProperty('regNumber');
            expect(res).toHaveProperty('status');
            expect(res).toHaveProperty('name');
            expect(res).toHaveProperty('batch');
            expect(res).toHaveProperty('destination');
            expect(res).toHaveProperty('imageUrl');
        });
    });
    describe('RouteService_convertToSequelizeOrderByClause', () => {
        it('should convert sort object to sequelize order array  ', () => {
            const sort = [
                { predicate: 'name', direction: 'asc' },
                { predicate: 'destination', direction: 'asc' },
                { predicate: 'driverName', direction: 'asc' },
                { predicate: 'driverPhoneNo', direction: 'asc' },
                { predicate: 'regNumber', direction: 'asc' },
            ];
            const result = route_service_1.routeService.convertToSequelizeOrderByClause(sort);
            expect(result).toEqual([[{ model: Route, as: 'route' }, 'name', 'asc'],
                [{ cab: { model: Cab, as: 'cabDetails' },
                        route: { model: Route, as: 'route' },
                        riders: { model: User, as: 'riders' },
                        destination: { model: Address, as: 'destination' },
                        homebase: { model: database_1.Homebase, as: 'homebase' } },
                    { model: Address, as: 'destination' },
                    'address',
                    'asc'],
                [{ model: Cab, as: 'cabDetails' }, 'driverName', 'asc'],
                [{ model: Cab, as: 'cabDetails' }, 'driverPhoneNo', 'asc'],
                [{ model: Cab, as: 'cabDetails' }, 'regNumber', 'asc']]);
        });
    });
    describe('RouteService_updateDefaultInclude', () => {
        it('should should update default include', () => {
            const where = {
                name: 'Island',
            };
            const result = route_service_1.routeService.updateDefaultInclude(where);
            expect(result.length).toEqual(4);
            expect(result[2]).toHaveProperty('where');
            expect(result[2].where).toHaveProperty('name');
        });
    });
    describe('Route Ratings', () => {
        it('should execute query ', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = [[]];
            const querySpy = jest.spyOn(database_1.default, 'query');
            querySpy.mockReturnValue(mockData);
            const results = yield route_service_1.routeService.routeRatings();
            expect(querySpy).toBeCalled();
            expect(results).toEqual(mockData);
        }));
    });
    describe('RouteService > defaultRouteDetails', () => {
        it('should return a list of default values (route details)', () => {
            const values = route_service_1.routeService.defaultRouteDetails;
            expect(values).toEqual(expect.arrayContaining(['id', 'status', 'capacity', 'takeOff', 'batch', 'comments']));
        });
    });
    describe('RouteService > defaultRouteGroupBy', () => {
        it('should return a list of default groupBy values', () => {
            const values = route_service_1.routeService.defaultRouteGroupBy();
            expect(values).toEqual(expect.arrayContaining(['RouteBatch.id', 'cabDetails.id', 'route.id', 'route->destination.id']));
        });
    });
    describe('RouteService > defaultPageable', () => {
        it('should return the default pageable', () => {
            const values = route_service_1.routeService.defaultPageable();
            expect(values).toEqual({ page: 1,
                size: 4294967295,
                sort: [{ direction: 'asc', predicate: 'id' }] });
        });
    });
    describe('RouteService > updateBatchLabel', () => {
        it('should update the batch label if the route batch was not created', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(route_service_1.routeService, 'getRouteById').mockImplementationOnce(() => (__mocks__1.routeMock[1].get()));
            const updatedLabel = yield route_service_1.routeService.updateBatchLabel({
                route: { id: 1 }, created: false
            });
            expect(updatedLabel).toEqual('B');
        }));
    });
});
//# sourceMappingURL=RouteService.spec.js.map