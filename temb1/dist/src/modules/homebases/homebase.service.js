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
const base_service_1 = require("../shared/base.service");
const homebase_1 = __importDefault(require("../../database/models/homebase"));
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
const user_service_1 = __importDefault(require("../users/user.service"));
const address_service_1 = require("../addresses/address.service");
const trip_service_1 = __importDefault(require("../trips/trip.service"));
const utils_1 = __importDefault(require("../../utils"));
const { models: { Country, Embassy, Provider, TripRequest } } = database_1.default;
class HomebaseService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(homebase_1.default)) {
        super(model);
    }
    createHomebase(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, channel, address, countryId, currency, opsEmail, travelEmail } = args;
            const newHomebaseName = this.formatName(name);
            const homebaseAddress = yield address_service_1.addressService.findOrCreateAddress(address.address, address.location);
            if (homebaseAddress.longitude == null || homebaseAddress.latitude == null) {
                throw new Error('please provide address location');
            }
            const [homebase] = yield this.model.findOrCreate({
                where: { name: { [sequelize_1.Op.iLike]: `${newHomebaseName.trim()}%` } },
                defaults: {
                    countryId,
                    channel,
                    currency,
                    opsEmail,
                    travelEmail,
                    name: newHomebaseName.trim(),
                    addressId: homebaseAddress.id,
                },
            });
            const { _options: { isNewRecord } } = homebase;
            return {
                homebase: homebase.get(),
                isNewHomebase: isNewRecord,
            };
        });
    }
    formatName(homebaseName) {
        const lowercasedName = homebaseName.toLowerCase();
        return lowercasedName.charAt(0).toUpperCase() + lowercasedName.slice(1);
    }
    getWhereClause(whereObject) {
        let where = {};
        const { country, name } = whereObject;
        if (country)
            where = { country: this.formatName(country) };
        if (name)
            where = Object.assign(Object.assign({}, where), { name: this.formatName(name) });
        return where;
    }
    getHomebases(pageable, where = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageMeta: { totalPages, limit, count, page }, data } = yield this.getPaginated({
                page: pageable.page,
                limit: pageable.size,
                defaultOptions: this.createFilter(where),
            });
            return {
                totalPages,
                homebases: data.map((item) => ({
                    id: item.id,
                    homebaseName: item.name,
                    channel: item.channel,
                    country: item.country ? item.country.name : null,
                    addressId: item.addressId,
                    locationId: item.locationId,
                    currency: item.currency,
                    opsEmail: item.opsEmail,
                    travelEmail: item.travelEmail,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                })),
                totalItems: count,
                pageNo: page,
                itemsPerPage: limit,
            };
        });
    }
    createFilter(where) {
        const { country: name } = where;
        if (name) {
            return {
                where,
                include: { model: Country, as: 'country', where: { name } },
            };
        }
        delete where.country;
        return { where, include: ['country'] };
    }
    getAllHomebases(withForeignKey = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const homebases = yield this.findAll({
                attributes: ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail'],
                order: [['name', 'ASC']],
                include: withForeignKey ? [{ model: Country, as: 'country', attributes: ['name'] }] : [],
            });
            return homebases;
        });
    }
    getHomeBaseBySlackId(slackId, withForeignKey = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { homebaseId } = yield user_service_1.default.getUserBySlackId(slackId);
            const homebase = yield this.findById(homebaseId, withForeignKey ? [{ model: Country, as: 'country', attributes: ['name'] }] : [], ['id', 'name', 'channel', 'addressId', 'locationId', 'currency', 'opsEmail', 'travelEmail']);
            return homebase;
        });
    }
    findHomeBaseByChannelId(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const homebase = yield this.findOneByProp({ prop: 'channel', value: channelId });
            return homebase ? homebase : {};
        });
    }
    getById(homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBase = yield this.findById(homebaseId);
            return homeBase;
        });
    }
    getByName(homebaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBase = yield this.findOneByProp({
                prop: 'name', value: { [sequelize_1.Op.iLike]: homebaseName },
            });
            return homeBase;
        });
    }
    updateDetails(name, id, channel, countryId, address, currency, opsEmail, travelEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const homebaseAddress = yield address_service_1.addressService
                .findOrCreateAddress(address.address, address.location);
            if (homebaseAddress.longitude == null || homebaseAddress.latitude == null) {
                throw new Error('please provide address location');
            }
            try {
                const foundname = yield this.getByName(name);
                if (foundname)
                    return { error: `Homebase with name '${name}' already exists` };
                const homebase = yield this.update(id, {
                    name, channel, countryId, currency, opsEmail, travelEmail, addressId: homebaseAddress.id
                });
                return homebase;
            }
            catch (err) {
                return (err.message);
            }
        });
    }
    getHomeBaseEmbassies(slackId, searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let embassies = [];
            const { id } = yield this.getHomeBaseBySlackId(slackId);
            const { countryId } = yield this.getById(id);
            if (searchKey) {
                embassies = yield Embassy.findAll({ where: {
                        countryId,
                        name: { [sequelize_1.Op.iLike]: `%${searchKey}%` },
                    } });
            }
            embassies = yield Embassy.findAll({ where: { countryId } });
            return embassies;
        });
    }
    filterHomebase(homebase, homebases) {
        return homebase ? homebases.filter((currentHomeBase) => currentHomeBase.name !== homebase.name) : homebases;
    }
    getMonthlyCompletedTrips() {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFilter = trip_service_1.default.sequelizeWhereClauseOption({
                requestedOn: { after: utils_1.default.getPreviousMonthsDate(1) },
            });
            const where = Object.assign({ tripStatus: 'Completed' }, dateFilter);
            return yield this.findAll({
                attributes: ['id', 'name', 'channel', 'opsEmail'],
                order: [['name', 'ASC']],
                include: [{ model: Provider,
                        attributes: ['name'],
                        required: true,
                        include: [{
                                where,
                                model: TripRequest,
                                attributes: ['name', 'createdAt'],
                            }],
                    }],
            });
        });
    }
}
exports.homebaseService = new HomebaseService();
exports.default = HomebaseService;
//# sourceMappingURL=homebase.service.js.map