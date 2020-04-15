"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserValidator_1 = __importDefault(require("./UserValidator"));
const AddressValidator_1 = __importDefault(require("./AddressValidator"));
const GeneralValidator_1 = __importDefault(require("./GeneralValidator"));
const TokenValidator_1 = __importDefault(require("./TokenValidator"));
const RouteValidator_1 = __importDefault(require("./RouteValidator"));
const RouteRequestValidator_1 = __importDefault(require("./RouteRequestValidator"));
const TripValidator_1 = __importDefault(require("./TripValidator"));
const CabsValidator_1 = __importDefault(require("./CabsValidator"));
const CleanRequestBody_1 = __importDefault(require("./CleanRequestBody"));
const CountryValidator_1 = __importDefault(require("./CountryValidator"));
const HomebaseValidator_1 = __importDefault(require("./HomebaseValidator"));
const ProviderValidator_1 = __importDefault(require("./ProviderValidator"));
const DriversValidator_1 = __importDefault(require("./DriversValidator"));
const HomeBaseFilterValidator_1 = __importDefault(require("./HomeBaseFilterValidator"));
const mainValidor_1 = __importDefault(require("./mainValidor"));
const middleware = {
    UserValidator: UserValidator_1.default,
    AddressValidator: AddressValidator_1.default,
    GeneralValidator: GeneralValidator_1.default,
    TokenValidator: TokenValidator_1.default,
    RouteValidator: RouteValidator_1.default,
    RouteRequestValidator: RouteRequestValidator_1.default,
    TripValidator: TripValidator_1.default,
    CabsValidator: CabsValidator_1.default,
    CleanRequestBody: CleanRequestBody_1.default,
    DriversValidator: DriversValidator_1.default,
    CountryValidator: CountryValidator_1.default,
    HomebaseValidator: HomebaseValidator_1.default,
    ProviderValidator: ProviderValidator_1.default,
    HomebaseFilterValidator: HomeBaseFilterValidator_1.default,
    mainValidator: mainValidor_1.default
};
exports.default = middleware;
//# sourceMappingURL=index.js.map