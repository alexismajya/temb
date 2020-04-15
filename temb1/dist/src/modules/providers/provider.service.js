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
const database_1 = __importStar(require("../../database"));
const providerHelper_1 = __importDefault(require("../../helpers/providerHelper"));
const base_service_1 = require("../shared/base.service");
const removeDataValues_1 = __importDefault(require("../../helpers/removeDataValues"));
const dm_notification_1 = require("./notifications/dm.notification");
const email_notification_1 = require("./notifications/email.notification");
const channel_notification_1 = require("./notifications/channel.notification");
const whatsapp_notfication_1 = require("./notifications/whatsapp.notfication");
const provider_1 = require("../../database/models/provider");
const route_service_1 = require("../routes/route.service");
class ProviderService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.Provider)) {
        super(model);
    }
    getProviders(pageable = providerHelper_1.default.defaultPageable, where = {}, homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const include = [{
                    model: database_1.User,
                    as: 'user',
                    attributes: ['name', 'phoneNo', 'email', 'slackId'],
                }, Object.assign({}, route_service_1.homebaseInfo),];
            const { pageMeta: { totalPages, limit, count, page }, data } = yield this.getPaginated({
                page: pageable.page,
                limit: pageable.size,
                defaultOptions: { include, where: Object.assign(Object.assign({}, where), { homebaseId }) },
            });
            return {
                data,
                pageMeta: {
                    totalPages,
                    pageNo: page,
                    totalItems: count,
                    itemsPerPage: limit,
                },
            };
        });
    }
    updateProvider(updateObject, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldProviderDetails = yield this.findById(providerId);
            if (!oldProviderDetails)
                return { message: 'Update Failed. Provider does not exist' };
            const updatedProviderDetails = yield this.update(providerId, Object.assign({}, updateObject));
            return updatedProviderDetails;
        });
    }
    deleteProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = yield this.model.destroy({
                where: { id },
            });
            return responseData;
        });
    }
    createProvider(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.add(providerData);
            return provider;
        });
    }
    findByPk(pk, withFks = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.findById(pk, withFks ? ['user'] : []);
            return provider;
        });
    }
    findProviderByUserId(providerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.findOneByProp({ prop: 'providerUserId', value: providerUserId });
            return provider;
        });
    }
    getProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.findById(id);
            return provider;
        });
    }
    getViableProviders(homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = yield this.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [{
                        model: database_1.Cab,
                        as: 'vehicles',
                    }, {
                        model: database_1.Driver,
                        as: 'drivers',
                    }, {
                        model: database_1.User,
                        as: 'user',
                        attributes: ['name', 'phoneNo', 'email', 'slackId'],
                    }],
                where: {
                    homebaseId,
                },
            });
            return providers.filter((provider) => {
                const p = provider;
                return p.vehicles.length > 0 && p.drivers.length > 0;
            });
        });
    }
    getProviderBySlackId(slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({
                include: [{
                        model: database_1.User,
                        where: { slackId },
                        as: 'user',
                        attributes: ['slackId', 'id', 'email'],
                    }],
            });
            return removeDataValues_1.default.removeDataValues(user);
        });
    }
    getProviderByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({
                include: [{
                        model: database_1.User,
                        where: { id },
                        as: 'user',
                        attributes: ['slackId'],
                    }],
            });
            return removeDataValues_1.default.removeDataValues(user);
        });
    }
    notifyTripRequest(provider, teamDetail, tripInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getNotifier(provider.notificationChannel)
                .notifyNewTripRequest(provider, tripInfo, teamDetail);
        });
    }
    verify(provider, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getNotifier(provider.notificationChannel)
                .sendVerificationMessage(provider, options);
        });
    }
    getNotifier(channel) {
        switch (channel) {
            case provider_1.ProviderNotificationChannel.directMessage:
                return new dm_notification_1.DirectMessage();
            case provider_1.ProviderNotificationChannel.email:
                return new email_notification_1.EmailNotification();
            case provider_1.ProviderNotificationChannel.channel:
                return new channel_notification_1.ChannelNotification();
            case provider_1.ProviderNotificationChannel.whatsapp:
                return new whatsapp_notfication_1.WhatsAppNotification();
            default:
                throw new Error('not implemented notification channel');
        }
    }
    activateProviderById(updateObject, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.update(providerId, Object.assign({}, updateObject));
                return provider;
            }
            catch (err) {
                const error = new Error('specified provider does not exist');
                error.name = 'ProviderUpdateError';
                throw error;
            }
        });
    }
    isDmOrChannel(channel) {
        return channel === provider_1.ProviderNotificationChannel.directMessage
            || channel === provider_1.ProviderNotificationChannel.channel;
    }
}
exports.providerService = new ProviderService();
exports.default = ProviderService;
//# sourceMappingURL=provider.service.js.map