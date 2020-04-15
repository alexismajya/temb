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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const base_service_1 = require("../shared/base.service");
class LocationService extends base_service_1.BaseService {
    constructor(model, logger) {
        super(model);
        this.logger = logger;
    }
    findLocation(longitude, latitude, includeAddress = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const include = includeAddress ? ['address'] : [];
                const location = yield this.model.findOne({
                    include,
                    where: {
                        [database_1.Op.and]: [{ latitude }, { longitude }],
                    },
                });
                return location ? location.get() : location;
            }
            catch (error) {
                this.logger.log(error);
                throw new Error('Could not find location record');
            }
        });
    }
    createLocation(longitude, latitude) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(longitude, latitude, 'hehehrhrhehe');
                const [newlocation, created] = yield this.model.findOrCreate({
                    where: { longitude, latitude },
                    defaults: { longitude, latitude },
                });
                console.log(newlocation, created);
                return newlocation.get();
            }
            catch (error) {
                this.logger.log(error);
                throw new Error('failed to create location');
            }
        });
    }
    getLocationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attributes = ['latitude', 'longitude'];
                const location = yield this.findById(Number(id), [], attributes);
                return location;
            }
            catch (error) {
                this.logger.log(error);
            }
        });
    }
}
exports.LocationService = LocationService;
//# sourceMappingURL=location.service.js.map