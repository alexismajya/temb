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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../shared/base.service");
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importStar(require("../../database"));
const cache_1 = __importDefault(require("../shared/cache"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const getTeamDetailsKey = (teamId) => `TEMBEA_V2_TEAMDETAILS_${teamId}`;
class TeamDetailsService extends base_service_1.RootService {
    constructor(model = database_1.default.getRepository(database_1.TeamDetails)) {
        super(model);
    }
    getTeamDetailsByToken(botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.findOneByProp({ prop: 'botToken', value: botToken });
                return result;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not get team details by token from DB');
            }
        });
    }
    getTeamDetails(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedValue = yield cache_1.default.fetch(getTeamDetailsKey(teamId));
            if (fetchedValue) {
                return fetchedValue;
            }
            try {
                const result = yield this.findOneByProp({ prop: 'teamId', value: teamId });
                yield cache_1.default.saveObject(getTeamDetailsKey(teamId), result);
                return result;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not get team details from DB');
            }
        });
    }
    getTeamDetailsByTeamUrl(teamUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedValue = yield cache_1.default.fetch(getTeamDetailsKey(teamUrl));
            if (fetchedValue) {
                return fetchedValue;
            }
            try {
                const teamDetails = yield database_1.TeamDetails.findOne({
                    raw: true,
                    where: {
                        teamUrl: { [sequelize_1.default.Op.or]: [`https://${teamUrl}`, teamUrl] },
                    },
                });
                yield cache_1.default.saveObject(getTeamDetailsKey(teamUrl), teamDetails);
                return teamDetails;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not get the team details.');
            }
        });
    }
    getTeamDetailsBotOauthToken(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botToken, } = yield this.getTeamDetails(teamId);
            return botToken;
        });
    }
    getAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allTeams = yield this.findAll({});
                return allTeams;
            }
            catch (error) {
                throw new Error('Could not get all teamDetails from DB');
            }
        });
    }
    saveTeamDetails(teamObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_1.TeamDetails.upsert(Object.assign({}, teamObject));
                yield cache_1.default.saveObject(getTeamDetailsKey(teamObject.teamId), teamObject);
                return teamObject;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                throw new Error('Could not update teamDetails or write new teamDetails to DB');
            }
        });
    }
}
exports.default = TeamDetailsService;
exports.teamDetailsService = new TeamDetailsService();
//# sourceMappingURL=teamDetails.service.js.map