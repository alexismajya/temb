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
const client_1 = require("@slack/client");
const SlackDialogModels_1 = require("../../../modules/slack/SlackModels/SlackDialogModels");
const dateHelper_1 = __importDefault(require("../../dateHelper"));
const teamDetails_service_1 = require("../../../modules/teamDetails/teamDetails.service");
const InputValidator_1 = __importDefault(require("./InputValidator"));
const Validators_1 = __importDefault(require("./Validators"));
const TripItineraryController_1 = require("../../../modules/slack/TripManagement/TripItineraryController");
const cleanData_1 = __importDefault(require("../../cleanData"));
class UserInputValidator {
    static fetchUserInformationFromSlack(userId, slackBotOauthToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const web = new client_1.WebClient(slackBotOauthToken);
            const { user } = yield web.users.info({
                token: slackBotOauthToken,
                user: userId
            });
            return user;
        });
    }
    static checkLocations(field, optionalField, fieldName, optionalFieldName) {
        const errors = [];
        const locationDescription = fieldName === 'pickup'
            ? 'Pickup location' : 'Destination';
        if (field !== 'Others' && optionalField) {
            errors.push(new SlackDialogModels_1.SlackDialogError(fieldName, `You must select 'Others' before entering a new ${locationDescription}.`), new SlackDialogModels_1.SlackDialogError(optionalFieldName, `Enter new location here after selecting 'Others' in the ${locationDescription} field.`));
        }
        if (field === 'Others' && !optionalField) {
            errors.push(new SlackDialogModels_1.SlackDialogError(optionalFieldName, `You selected 'Others' in the ${locationDescription} field, please enter a new location.`));
        }
        return errors;
    }
    static validateTravelContactDetails(data) {
        const payload = cleanData_1.default.trim(data);
        const { submission: { noOfPassengers, riderPhoneNo, travelTeamPhoneNo } } = payload;
        const errors = [];
        errors.push(...Validators_1.default.validateRegex('checkNumber', noOfPassengers, 'noOfPassengers'));
        errors.push(...InputValidator_1.default.checkNumberGreaterThanZero(noOfPassengers, 'noOfPassengers', 'number of passengers'));
        errors.push(...Validators_1.default.validateRegex('checkNumber', riderPhoneNo, 'riderPhoneNo'));
        errors.push(...Validators_1.default.validateRegex('checkNumber', travelTeamPhoneNo, 'travelTeamPhoneNo'));
        errors.push(...Validators_1.default.checkMinLengthNumber(6, riderPhoneNo, 'riderPhoneNo'));
        errors.push(...Validators_1.default.checkMinLengthNumber(6, travelTeamPhoneNo, 'travelTeamPhoneNo'));
        errors.push(...Validators_1.default.validateEmptyAndSpaces(noOfPassengers, 'noOfPassengers'));
        errors.push(...Validators_1.default.validateEmptyAndSpaces(riderPhoneNo, 'riderPhoneNo'));
        errors.push(...Validators_1.default.validateEmptyAndSpaces(travelTeamPhoneNo, 'travelTeamPhoneNo'));
        errors.push(...Validators_1.default.checkDuplicatePhoneNo(riderPhoneNo, travelTeamPhoneNo));
        return errors;
    }
    static validateTravelFormSubmission(formSubmission) {
        const { pickup, destination } = formSubmission;
        const errors = [];
        errors.push(...Validators_1.default.checkLocationsWithoutOthersField(pickup, destination));
        if (formSubmission.flightNumber) {
            errors.push(...Validators_1.default.validateRegex('checkNumbersAndLetters', formSubmission.flightNumber, 'flightNumber'));
        }
        return errors;
    }
    static validatePickupDestinationEntry(payload, type, dateFieldName, travelDateTime, allowedHours) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            if (type === 'pickup') {
                const { pickup, othersPickup, flightNumber } = payload.submission;
                errors.push(...Validators_1.default.validateRegex('checkWord', pickup, 'pickup'));
                errors.push(...this.checkLocations(pickup, othersPickup, 'pickup', 'othersPickup'));
                errors.push(...Validators_1.default.checkDateTimeIsHoursAfterNow(allowedHours, travelDateTime, dateFieldName));
                errors.push(...Validators_1.default.validateRegex('checkNumbersAndLetters', flightNumber, 'flightNumber'));
                try {
                    errors.push(...yield UserInputValidator.validateDateAndTimeEntry(payload, dateFieldName));
                }
                catch (error) {
                }
            }
            else {
                const { destination, othersDestination } = payload.submission;
                errors.push(...Validators_1.default.validateRegex('checkWord', destination, 'destination'));
                errors.push(...this.checkLocations(destination, othersDestination, 'destination', 'othersDestination'));
            }
            return errors;
        });
    }
    static validatePickupDestinationLocationEntries(payload, typeOfDialogBox) {
        if (typeOfDialogBox === 'pickup') {
            const { submission: { pickup, othersPickup } } = payload;
            return UserInputValidator.validateDialogBoxLocation(pickup, othersPickup, typeOfDialogBox);
        }
        const { submission: { destination, othersDestination, pickup } } = payload;
        const errors = [];
        errors.push(...Validators_1.default.checkOriginAnDestination(pickup, destination, 'pickup', 'destination'));
        errors.push(...UserInputValidator.validateDialogBoxLocation(destination, othersDestination, typeOfDialogBox));
        return errors;
    }
    static validateDialogBoxLocation(firstLocation, secondLocation, typeOfDialogBox) {
        const errors = [];
        errors.push(...Validators_1.default.validateRegex('checkWord', firstLocation, typeOfDialogBox));
        errors.push(...UserInputValidator.checkLocations(firstLocation, secondLocation, typeOfDialogBox, `others${typeOfDialogBox}`));
        return errors;
    }
    static validateLocationEntries(payload) {
        const { pickup, othersPickup, destination, othersDestination } = payload.submission;
        const errors = [];
        errors.push(...Validators_1.default.validateRegex('checkWord', pickup, 'pickup'));
        errors.push(...Validators_1.default.validateRegex('checkWord', destination, 'destination'));
        errors.push(...Validators_1.default.checkOriginAnDestination(pickup, destination, 'pickup', 'destination'));
        errors.push(...this.checkLocations(pickup, othersPickup, 'pickup', 'othersPickup'));
        errors.push(...this.checkLocations(destination, othersDestination, 'destination', 'othersDestination'));
        return errors;
    }
    static validateDateAndTimeEntry(payload, fieldName = 'dateTime') {
        return __awaiter(this, void 0, void 0, function* () {
            const { submission, team: { id: teamId } } = payload;
            const date = submission.dateTime
                || submission.flightDateTime || submission.embassyVisitDateTime;
            const sanitizedDate = date.trim().replace(/\s\s+/g, ' ');
            const errors = [];
            try {
                const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
                const user = yield UserInputValidator.fetchUserInformationFromSlack(payload.user.id, slackBotOauthToken);
                errors.push(...Validators_1.default.checkDate(sanitizedDate, user.tz_offset, fieldName));
                errors.push(...Validators_1.default.checkDateTimeFormat(dateHelper_1.default.changeDateTimeFormat(sanitizedDate), fieldName));
                return errors;
            }
            catch (error) {
                throw new Error('There was a problem processing your request');
            }
        });
    }
    static validateCabDetails(payload) {
        const { driverName, driverPhoneNo, regNumber, model, capacity } = payload.submission;
        const errors = [];
        errors.push(...Validators_1.default.validateRegex('checkUsername', driverName, 'driverName'));
        errors.push(...Validators_1.default.validateRegex('checkPhoneNumber', driverPhoneNo, 'driverPhoneNo'));
        errors.push(...Validators_1.default.validateRegex('checkNumberPlate', regNumber, 'regNumber'));
        errors.push(...Validators_1.default.validateRegex('checkWord', model, 'model'));
        errors.push(...Validators_1.default.validateRegex('checkNumber', capacity, 'capacity'));
        return errors;
    }
    static validateCoordinates(payload) {
        const { coordinates, otherBusStop } = payload.submission;
        const data = coordinates || otherBusStop;
        const fieldName = coordinates ? 'coordinates' : 'otherBusStop';
        const errors = [];
        errors.push(...InputValidator_1.default.checkValidCoordinates(data, fieldName));
        return errors;
    }
    static validateApproveRoutesDetails(data) {
        const payload = cleanData_1.default.trim(data);
        const { routeName, takeOffTime } = payload.submission;
        const errors = [];
        errors.push(...Validators_1.default.validateRegex('checkWord', routeName, 'routeName'));
        errors.push(...Validators_1.default.checkTimeFormat(takeOffTime, 'takeOffTime'));
        return errors;
    }
    static validateSkipToPage(payload) {
        const page = Number(TripItineraryController_1.getPageNumber(payload) || -1);
        if (Number.isNaN(page) || page === -1) {
            return {
                errors: [
                    new SlackDialogModels_1.SlackDialogError('pageNumber', 'Not a number')
                ]
            };
        }
    }
    static validateEngagementForm(engagementFormData) {
        const { workingHours } = cleanData_1.default.trim(engagementFormData);
        if (!Validators_1.default.isDateFormatValid(workingHours)) {
            return {
                errors: [
                    new SlackDialogModels_1.SlackDialogError('workingHours', 'Invalid date')
                ]
            };
        }
    }
    static validateSearchRoute(search) {
        if (!search.trim()) {
            return {
                errors: [
                    new SlackDialogModels_1.SlackDialogError('search', 'search cannot be empty')
                ]
            };
        }
    }
    static validateStartRouteSubmission(payload) {
        let errors;
        const { submission } = payload;
        if (submission && submission.pageNumber) {
            errors = UserInputValidator.validateSkipToPage(payload);
        }
        if (submission && submission.search) {
            errors = UserInputValidator.validateSearchRoute(submission.search);
        }
        return errors;
    }
    static getScheduleTripDetails(tripData) {
        const userTripData = Object.assign({}, tripData);
        const { destination, pickup, othersDestination, othersPickup } = userTripData;
        userTripData.destination = destination === 'Others' ? othersDestination : destination;
        userTripData.pickup = pickup === 'Others' ? othersPickup : pickup;
        Object.keys(userTripData).map((key) => {
            if (key === 'pickUpAddress' || key === 'destinationAddress') {
                const type = key === 'pickUpAddress' ? 'pickup' : 'destination';
                userTripData[type] = userTripData[key].address;
                userTripData[`${type}Lat`] = userTripData[key].latitude;
                userTripData[`${type}Long`] = userTripData[key].longitude;
            }
            return true;
        });
        return userTripData;
    }
}
exports.default = UserInputValidator;
//# sourceMappingURL=index.js.map