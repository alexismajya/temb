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
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const googleMapsHelpers_1 = require("../../helpers/googleMaps/googleMapsHelpers");
class GoogleMapsSuggestions {
    static getPlacesAutoComplete(placesSuggestionOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
            const options = {
                qs: placesSuggestionOptions
            };
            try {
                const response = yield googleMapsHelpers_1.getGoogleLocationPayload(uri, options);
                return response;
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
}
exports.default = GoogleMapsSuggestions;
//# sourceMappingURL=GoogleMapsSuggestions.js.map