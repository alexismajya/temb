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
const location_service_1 = require("../location.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
const database_1 = require("../../../database");
class MockLocation {
    constructor() {
        this.locations = [];
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const [{ latitude }, { longitude }] = options.where[database_1.Op.and];
                    if (latitude == null || longitude == null)
                        throw new Error();
                    const found = this.locations.find((l) => {
                        return l.longitude === longitude && l.latitude === latitude;
                    });
                    found ? resolve({ get: () => found }) : resolve(found);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    findOrCreate(options) {
        return new Promise((resolve, reject) => {
            try {
                const { latitude, longitude } = options.defaults;
                if (latitude && longitude) {
                    let theLocation = this.locations.find((l) => {
                        console.log(longitude, 'long', latitude, 'lat');
                        return l.longitude === longitude && l.latitude === latitude;
                    });
                    console.log(theLocation, 'location');
                    if (theLocation)
                        resolve([theLocation, false]);
                    theLocation = { latitude, longitude, id: this.locations.length + 2 };
                    this.locations.push(theLocation);
                    resolve([{ get: () => theLocation }, true]);
                }
                throw new Error();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    findByPk(pk, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const found = this.locations.find((l) => l.id === pk);
                resolve(found ? { get: () => found } : found);
            });
        });
    }
}
exports.mockLocationRepo = new MockLocation();
exports.mockLocationService = new location_service_1.LocationService(exports.mockLocationRepo, logger_1.mockLogger);
//# sourceMappingURL=location.service.js.map