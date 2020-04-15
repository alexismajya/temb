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
const sequelize_1 = require("sequelize");
const database_1 = __importStar(require("../../database"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const locations_1 = require("../locations");
const base_service_1 = require("../shared/base.service");
const homebase_service_1 = require("../homebases/homebase.service");
class AddressService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.Address), location = locations_1.locationService, logger = bugsnagHelper_1.default) {
        super(model);
        this.location = location;
        this.logger = logger;
    }
    findAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const place = yield this.findOneByProp({ prop: 'address', value: address }, ['location']);
                return place;
            }
            catch (error) {
                this.logger.log(error);
                throw new Error('Could not find address record');
            }
        });
    }
    findAddressByCoordinates(longitude, latitude) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.location.findLocation(longitude, latitude, true);
            if (location)
                return location.address;
        });
    }
    findOrCreateAddress(address, location) {
        return __awaiter(this, void 0, void 0, function* () {
            let theLocation = {};
            if (location) {
                theLocation = yield this.location.createLocation(location.longitude, location.latitude);
            }
            const { data } = yield this.findOrCreate(address, theLocation.id);
            return Object.assign(Object.assign({}, data), { longitude: theLocation.longitude, latitude: theLocation.latitude });
        });
    }
    findOrCreate(address, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOrCreate({
                where: {
                    address: { [sequelize_1.Op.iLike]: `${address}%` },
                },
                defaults: { address, locationId },
            });
            const [data, created] = result;
            return { created, data: data.get() };
        });
    }
    createNewAddress(longitude, latitude, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield this.location.createLocation(longitude, latitude);
                const { data, created } = yield this.findOrCreate(address, location.id);
                const newAddressData = {
                    id: data.id,
                    address: data.address,
                    longitude: location.longitude,
                    latitude: location.latitude,
                    isNewAddress: created,
                };
                return newAddressData;
            }
            catch (error) {
                this.logger.log(error);
                throw new Error('Could not create address');
            }
        });
    }
    updateAddress(address, newLongitude, newLatitude, newAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressData = yield this.findAddress(address);
                const result = yield locations_1.locationService.createLocation(newLongitude, newLatitude);
                console.log(result, 'addressData');
                const updated = yield this.update(addressData.id, {
                    locationId: null,
                    address: (newAddress || addressData.address).trim(),
                }, {
                    returning: true,
                    include: ['location'],
                });
                return updated;
            }
            catch (error) {
                this.logger.log(error);
                throw new Error('Could not update address record');
            }
        });
    }
    getAddressesFromDB(size, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageMeta: { count, totalPages }, data, } = yield this.getPaginated({
                page,
                limit: size,
                defaultOptions: {
                    include: ['location'],
                    order: [['id', 'DESC']],
                },
            });
            return { count, totalPages, rows: data };
        });
    }
    findCoordinatesByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressCoords = yield this.findOneByProp({ prop: 'address', value: address }, ['location']);
            return addressCoords;
        });
    }
    getAddressListByHomebase(homebaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressesList = yield this.findAll({
                where: { isDefault: true },
                include: [{
                        model: database_1.Homebase,
                        where: { name: { [sequelize_1.Op.iLike]: `%${homebaseName}%` } },
                        attributes: [],
                    }],
                attributes: ['address'],
            }).then((addresses) => addresses.map((a) => a.address));
            return addressesList;
        });
    }
    searchAddressListByHomebase(homebase, searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressesList = yield this.findAll({
                where: { isDefault: true, address: { [sequelize_1.Op.iLike]: `%${searchKey}%` } },
                include: [{
                        model: database_1.Homebase,
                        where: { name: { [sequelize_1.Op.iLike]: `%${homebase}%` } },
                    }],
                attributes: ['address'],
            }).then((addresses) => addresses.map((a) => a.address));
            return addressesList;
        });
    }
    findAddressIfExists(addressToCheck) {
        return __awaiter(this, void 0, void 0, function* () {
            const listOfPosssibleAddresses = yield database_1.Address.findAll({
                where: {
                    address: {
                        [sequelize_1.Op.like]: `%${homebase_service_1.homebaseService.formatName(addressToCheck)}%`,
                    },
                },
                include: [{
                        model: database_1.Location,
                        attributes: ['latitude', 'longitude'],
                    }],
            });
            return listOfPosssibleAddresses;
        });
    }
    findAddressById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const includeLocation = {
                model: database_1.Location,
                attributes: ['latitude', 'longitude'],
            };
            const address = yield this.findById(id, [includeLocation], ['address']);
            return address;
        });
    }
}
exports.default = AddressService;
exports.addressService = new AddressService();
//# sourceMappingURL=address.service.js.map