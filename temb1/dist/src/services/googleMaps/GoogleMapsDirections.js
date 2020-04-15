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
const axios_1 = __importDefault(require("axios"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
class GoogleMapsDirections {
    static getDirections(origin, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = process.env.GOOGLE_MAPS_API_KEY;
                const directionURL = 'https://maps.googleapis.com/maps/api/directions/json?';
                const response = yield axios_1.default.get(directionURL, {
                    params: {
                        origin,
                        destination,
                        key
                    }
                });
                return response.data;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = GoogleMapsDirections;
//# sourceMappingURL=GoogleMapsDirections.js.map