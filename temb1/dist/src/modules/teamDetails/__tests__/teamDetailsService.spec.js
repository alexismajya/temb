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
const teamDetails_service_1 = require("../teamDetails.service");
const database_1 = __importDefault(require("../../../database"));
const cache_1 = __importDefault(require("../../shared/cache"));
const mockData_1 = __importDefault(require("../__mocks__/mockData"));
const { models: { TeamDetails } } = database_1.default;
describe('Team details service', () => {
    const data = mockData_1.default;
    beforeAll(() => {
        cache_1.default.fetch = jest.fn((teamId) => {
            if (teamId === 'SAVEDTEAMID') {
                return {
                    data,
                };
            }
        });
    });
    it('should get team details from cache', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(data);
        const teamDetails = yield teamDetails_service_1.teamDetailsService.getTeamDetails('SAVEDTEAMID');
        expect(teamDetails).toEqual(data);
    }));
    it('should fetch team details from DB', (done) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(data);
        jest.spyOn(TeamDetails, 'findByPk').mockReturnValue({ teamId: 'SAVEDTEAMID', teamName: 'T1' });
        const teamDetails = yield teamDetails_service_1.teamDetailsService.getTeamDetails('SAVEDTEAMID');
        expect(teamDetails).toEqual(data);
        done();
    }));
    it('should throw a db error', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield teamDetails_service_1.teamDetailsService.getTeamDetails('');
        }
        catch (error) {
            expect(error.message).toBe('Could not get team details from DB');
        }
    }));
    it('should save new team details', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield teamDetails_service_1.teamDetailsService.saveTeamDetails({
            botId: 'XXXXXXX',
            botToken: 'XXXXXXXXXXXXX',
            teamId: 'XXXXXXX',
            teamName: 'Fake Team',
            userId: 'XXXXXXXXXXXXX',
            userToken: 'XXXXXXXXXXX',
            webhookConfigUrl: 'XXXXXXXXXXXXX',
            opsChannelId: 'XXXXXXXXXXXXX',
            teamUrl: 'faketeam.slack.come',
        });
        expect(result).toEqual({
            botId: 'XXXXXXX',
            botToken: 'XXXXXXXXXXXXX',
            teamId: 'XXXXXXX',
            teamName: 'Fake Team',
            userId: 'XXXXXXXXXXXXX',
            userToken: 'XXXXXXXXXXX',
            webhookConfigUrl: 'XXXXXXXXXXXXX',
            opsChannelId: 'XXXXXXXXXXXXX',
            teamUrl: 'faketeam.slack.come',
        });
    }));
    it('should throw an error on team details', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(TeamDetails, 'upsert').mockRejectedValue(new Error());
        try {
            yield teamDetails_service_1.teamDetailsService.saveTeamDetails({ teamId: 'TSTDST' });
        }
        catch (error) {
            expect(error.message).toEqual('Could not update teamDetails or write new teamDetails to DB');
        }
    }));
    describe('TeamDetailsService_getAllTeams', () => {
        beforeEach(() => {
            jest.spyOn(TeamDetails, 'findAll').mockResolvedValue(data);
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should fetch all team details from DB', () => __awaiter(void 0, void 0, void 0, function* () {
            const allTeams = yield teamDetails_service_1.teamDetailsService.getAllTeams();
            expect(TeamDetails.findAll).toBeCalled();
            expect(allTeams[0].teamId).toEqual('SAVEDTEAMID');
            expect(allTeams).not.toBeNaN();
        }));
        it('should throw an error when it cannot get team details', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(TeamDetails, 'findAll').mockImplementation(() => {
                throw new Error();
            });
            try {
                yield teamDetails_service_1.teamDetailsService.getAllTeams();
            }
            catch (error) {
                expect(error.message).toEqual('Could not get all teamDetails from DB');
            }
        }));
    });
});
describe('getTeamDetailsByTeamUrl', () => {
    const teamUrl = 'teamUrl';
    const data = { data: 'team details' };
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
    });
    it('should fetch team details from catch', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(data);
        const result = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
        expect(TeamDetails.findOne).not.toHaveBeenCalled();
        expect(cache_1.default.fetch).toHaveBeenCalled();
        expect(result).toEqual(data);
    }));
    it('should fetch team details from database and save it in cache', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(null);
        jest.spyOn(TeamDetails, 'findOne').mockResolvedValue(data);
        cache_1.default.saveObject = jest.fn(() => { });
        const result = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
        expect(cache_1.default.saveObject).toBeCalledWith(`TEMBEA_V2_TEAMDETAILS_${teamUrl}`, data);
        expect(result).toEqual(data);
    }));
    it('should fail on get team details by URL', () => __awaiter(void 0, void 0, void 0, function* () {
        cache_1.default.fetch = jest.fn(() => null);
        TeamDetails.findOne = jest.fn(() => Promise.reject(new Error('')));
        expect(teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl))
            .rejects.toThrow('Could not get the team details.');
    }));
});
//# sourceMappingURL=teamDetailsService.spec.js.map