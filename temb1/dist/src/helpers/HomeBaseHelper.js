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
const homebase_service_1 = require("../modules/homebases/homebase.service");
const homebase_1 = __importDefault(require("../database/models/homebase"));
const country_1 = __importDefault(require("../database/models/country"));
const googleMapsHelpers_1 = require("./googleMaps/googleMapsHelpers");
exports.homeBaseModelHelper = () => {
    const homeBaseInclude = {
        model: homebase_1.default,
        as: 'homebase',
        attributes: ['id', 'name'],
        include: [{ model: country_1.default, as: 'country', attributes: ['name', 'id', 'status'] }],
    };
    return homeBaseInclude;
};
class HomeBaseHelper {
    static checkIfHomeBaseExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeBase = yield homebase_service_1.homebaseService.getById(id);
            return homeBase;
        });
    }
    static checkLocationInHomeBase(location, homebase) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedLocation = yield googleMapsHelpers_1.RoutesHelper.getPlaceInfo('coordinates', location);
            return selectedLocation.plus_code.locality
                .local_address.toLowerCase().includes(homebase.country.name.toLowerCase());
        });
    }
}
exports.default = HomeBaseHelper;
//# sourceMappingURL=HomeBaseHelper.js.map