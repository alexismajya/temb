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
const client_1 = require("@slack/client");
const database_1 = __importStar(require("../../database"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const base_service_1 = require("../shared/base.service");
const trip_service_1 = __importDefault(require("../trips/trip.service"));
class UserService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.User)) {
        super(model);
        this.getUserById = (id) => __awaiter(this, void 0, void 0, function* () { return this.findById(id); });
        this.getUserBySlackId = (slackId) => __awaiter(this, void 0, void 0, function* () {
            return this.findOneByProp({
                prop: 'slackId', value: slackId,
            }, ['homebase']);
        });
        this.getUserByEmail = (email, withFk = false) => __awaiter(this, void 0, void 0, function* () {
            return this.findOneByProp({
                prop: 'email', value: email,
            }, withFk ? this.defaultInclude : []);
        });
        this.updateUser = (id, updateObject, returning) => __awaiter(this, void 0, void 0, function* () { return this.update(id, updateObject, returning); });
        this.deleteUser = (id) => __awaiter(this, void 0, void 0, function* () { return this.delete(id); });
        this.defaultInclude = ['roles', 'homebase', 'routeBatch'];
    }
    getUserSlackInfo(web, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = yield web.users.lookupByEmail({
                    email: email.trim(),
                });
                return userInfo.ok ? userInfo.user : null;
            }
            catch (error) {
                errorHandler_1.default.throwErrorIfNull(null, 'User not found. If your are providing a newEmail, '
                    + 'it must be the same as the user\'s email on slack', 424);
            }
        });
    }
    getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.findOneByProp({ prop: 'email', value: email });
                errorHandler_1.default.throwErrorIfNull(user, 'User not found');
                return user;
            }
            catch (error) {
                if (error instanceof errorHandler_1.default)
                    throw error;
                errorHandler_1.default.throwErrorIfNull(null, 'Could not find user with specified email', 500);
            }
        });
    }
    findOrCreateNewUserWithSlackId(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newUser] = yield this.model.findOrCreate({
                where: { slackId: user.slackId },
                defaults: { name: user.name, email: user.email },
            });
            return newUser.get({ plain: true });
        });
    }
    saveNewRecord(user, slackUserInfo, newName, newEmail, newPhoneNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.update(user.id, {
                slackId: slackUserInfo.id,
                name: (newName || user.name).trim(),
                email: (newEmail || user.email).trim(),
                phoneNo: (newPhoneNo || user.phoneNo).trim(),
            }, { returning: true });
            return updated;
        });
    }
    createNewUser(slackUserInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, profile: { real_name, email } } = slackUserInfo;
                const user = yield this.add({ email, slackId: id, name: real_name });
                return user;
            }
            catch (error) {
                errorHandler_1.default.throwErrorIfNull(null, 'Could not create user', 500);
            }
        });
    }
    getUserInfo(slackUrl, email, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const slackClient = yield this.getSlackClient(slackUrl);
            const result = yield this.getUserSlackInfo(slackClient, newEmail || email);
            return result;
        });
    }
    getUsersFromDB(size, page, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let defaultOptions = {
                order: [['id', 'DESC']],
                include: [{ model: database_1.Homebase, attributes: ['name'] }, { model: database_1.Role, attributes: ['name'] }],
            };
            if (filter) {
                defaultOptions = {
                    where: { name: { [database_1.Op.iLike]: `%${filter}%` } },
                    order: [['id', 'DESC']],
                    include: [{ model: database_1.Homebase, attributes: ['name'] }, { model: database_1.Role, attributes: ['name'] }],
                };
            }
            const users = yield this.getPaginated({
                page,
                defaultOptions,
                limit: size,
            });
            return {
                rows: users.data,
                count: users.pageMeta.count,
            };
        });
    }
    getPagedFellowsOnOrOffRoute(onRoute = true, { size, page }, filterBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { homebaseId } = filterBy;
            const routeBatchCriteria = onRoute ? { [database_1.Op.ne]: null } : { [database_1.Op.eq]: null };
            const results = yield this.getPaginated({
                page, limit: size,
                defaultOptions: {
                    where: {
                        homebaseId,
                        email: {
                            [database_1.Op.iLike]: '%andela.com',
                            [database_1.Op.notILike]: '%apprenticeship@andela.com',
                        },
                        routeBatchId: routeBatchCriteria,
                    },
                },
            });
            return {
                data: results.data,
                pageMeta: {
                    totalPages: results.pageMeta.totalPages,
                    currentPage: results.pageMeta.page,
                    limit: results.pageMeta.limit,
                    totalItems: results.pageMeta.count,
                },
            };
        });
    }
    updateDefaultHomeBase(userSlackId, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId } = yield this.getUserBySlackId(userSlackId);
            yield this.updateUser(userId, { homebaseId });
            return homebaseId;
        });
    }
    createUserByEmail(teamUrl, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.getUserInfo(teamUrl, email, '');
            if (!userInfo) {
                throw new Error('user does not exist on this  workspace');
            }
            const user = yield this.findOrCreateNewUserWithSlackId({
                slackId: userInfo.id, name: userInfo.real_name, email: userInfo.profile.email,
            });
            return user;
        });
    }
    getSlackClient(slackUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamDetails = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(slackUrl);
            if (!teamDetails)
                throw new errorHandler_1.default('Slack team not found', 404);
            const web = new client_1.WebClient(teamDetails.botToken);
            return web;
        });
    }
    getWeeklyCompletedTrips(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = trip_service_1.default.sequelizeWhereClauseOption({
                departureTime: { after: date },
                status: 'Completed',
            });
            return this.findAll({
                attributes: ['id', 'email', 'name'],
                include: [{ where,
                        model: database_1.TripRequest,
                        required: true,
                        attributes: ['id', 'name', 'tripType'],
                    }],
            });
        });
    }
    getWeeklyCompletedRoutes(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                userAttendStatus: 'Confirmed',
                createdAt: {
                    [database_1.Op.gte]: date,
                },
            };
            return this.findAll({
                attributes: ['id', 'email', 'name'],
                include: [{ where, model: database_1.BatchUseRecord, required: true }],
            });
        });
    }
    getUsersSlackId() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.findAll({
                attributes: ['slackId', 'name'],
            });
            return users;
        });
    }
}
exports.UserService = UserService;
const userService = new UserService();
exports.default = userService;
//# sourceMappingURL=user.service.js.map