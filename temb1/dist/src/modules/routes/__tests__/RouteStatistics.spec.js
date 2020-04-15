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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_statistics_service_1 = require("../../routes/route-statistics.service");
const routeRiderStatistics_1 = __importDefault(require("../__mocks__/routeRiderStatistics"));
const AISService_1 = __importDefault(require("../../../services/AISService"));
const database_1 = __importDefault(require("../../../database"));
const { models: { BatchUseRecord } } = database_1.default;
describe('routeStatistics - getFrequentRiders', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should return an object of rider statistics ', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(BatchUseRecord, 'findAll').mockResolvedValue(routeRiderStatistics_1.default);
        const data = yield route_statistics_service_1.routeStatistics.getFrequentRiders('DESC', '2018-01-01', '2019-12-11', 1);
        expect(BatchUseRecord.findAll).toBeCalled();
        expect(data).toEqual(routeRiderStatistics_1.default.map((e) => e.get({ plain: true })));
    }));
    it('should return an error in catch block', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(BatchUseRecord, 'findAll').mockRejectedValue(Error('some error'));
        const data = yield route_statistics_service_1.routeStatistics.getFrequentRiders('DESC', '2018-01-01', '2019-12-11', 1);
        expect(data).toBe('some error');
    }));
});
describe('routeStatistics - getTopAndLeastFrequentRiders', () => {
    let mockedFunction;
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        mockedFunction = jest.spyOn(route_statistics_service_1.routeStatistics, 'getFrequentRiders');
    });
    it('should call getFrequentRiders twice', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_statistics_service_1.routeStatistics, 'addUserPictures').mockImplementation(() => jest.fn());
        yield route_statistics_service_1.routeStatistics.getTopAndLeastFrequentRiders('2018-01-01', '2019-12-31', 1);
        expect(mockedFunction).toBeCalledTimes(2);
    }));
    it('should return top and least frequent riders', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(route_statistics_service_1.routeStatistics, 'getFrequentRiders').mockResolvedValue(routeRiderStatistics_1.default);
        jest.spyOn(route_statistics_service_1.routeStatistics, 'addUserPictures').mockResolvedValue(routeRiderStatistics_1.default);
        const mockedResult = {
            firstFiveMostFrequentRiders: routeRiderStatistics_1.default,
            leastFiveFrequentRiders: routeRiderStatistics_1.default,
        };
        const result = yield route_statistics_service_1.routeStatistics.getTopAndLeastFrequentRiders('2018-01-01', '2019-12-31', 1);
        expect(result).toStrictEqual(mockedResult);
    }));
    it('should return an error in catch block', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedFunction.mockResolvedValue(Promise.reject(new Error('some error')));
        const data = yield route_statistics_service_1.routeStatistics.getTopAndLeastFrequentRiders('2018-01-01', '2019-12-31', 1);
        expect(data).toBe('some error');
    }));
});
describe('routeStatistics - getUserPicture', () => {
    const mockedData = 'https://lh6.googleusercontent.com/-jBtpXcQOrXs/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rcsm2s5f9G9LxqmJ4EX9JZDM7NFzA/s50/photo.jpg';
    let mockAISService;
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        mockAISService = jest.spyOn(AISService_1.default, 'getUserDetails');
    });
    it('should return a link to the profile picture', () => __awaiter(void 0, void 0, void 0, function* () {
        mockAISService.mockResolvedValue({ picture: mockedData });
        const url = yield route_statistics_service_1.routeStatistics.getUserPicture('mosinmiloluwa.owoso@andela.com');
        expect(url).toEqual(mockedData);
    }));
    it('should return a default profile picture', () => __awaiter(void 0, void 0, void 0, function* () {
        mockAISService.mockResolvedValue({ picture: '' });
        const url = yield route_statistics_service_1.routeStatistics.getUserPicture('johnxeyz@andela.com');
        expect(url).toEqual('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    }));
});
describe('routeStatistics - addUserPictures', () => {
    let mockAddUserPictures;
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        mockAddUserPictures = jest.spyOn(route_statistics_service_1.routeStatistics, 'addUserPictures');
    });
    it('should add profile picture in the object returned', () => __awaiter(void 0, void 0, void 0, function* () {
        const d = routeRiderStatistics_1.default.map((e) => e.get({ plain: true }));
        mockAddUserPictures.mockResolvedValue(d);
        const data = yield route_statistics_service_1.routeStatistics.addUserPictures(d);
        expect(data[0]).toHaveProperty('picture');
    }));
});
//# sourceMappingURL=RouteStatistics.spec.js.map