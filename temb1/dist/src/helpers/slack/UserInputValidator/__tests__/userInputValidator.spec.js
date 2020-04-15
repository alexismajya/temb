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
const moment_1 = __importDefault(require("moment"));
const index_1 = __importDefault(require("../index"));
const Validators_1 = __importDefault(require("../Validators"));
const dateHelper_1 = __importDefault(require("../../../dateHelper"));
const SlackInteractions_mock_1 = require("../../../../modules/slack/SlackInteractions/__mocks__/SlackInteractions.mock");
const teamDetails_service_1 = require("../../../../modules/teamDetails/teamDetails.service");
const managerFormValidator_1 = __importDefault(require("../managerFormValidator"));
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        chat: { postMessage: jest.fn(() => Promise.resolve(() => { })) },
        users: {
            info: jest.fn(() => Promise.resolve({
                user: { real_name: 'someName', profile: {} },
                token: 'sdf'
            })),
            profile: {
                get: jest.fn(() => Promise.resolve({
                    profile: {
                        tz_offset: 'someValue',
                        email: 'sekito.ronald@andela.com'
                    }
                }))
            }
        }
    }))
}));
describe('UserInputValidator', () => {
    it('should strip trip data to get trip details', () => {
        const tripData = SlackInteractions_mock_1.createTripDetails();
        const result = index_1.default.getScheduleTripDetails(tripData);
        expect(result.pickupLat).toBeDefined();
        expect(result.destinationLat).toBeDefined();
        expect(result.destinationLat).toEqual(-1.2197531);
    });
});
describe('checkNumbersAndLetters', () => {
    it('should accept numbers and letters', () => {
        const errors = Validators_1.default.validateRegex('checkNumbersAndLetters', '0A', 'name');
        expect(errors.length).toEqual(0);
    });
    it('should not accept letters and special characters', () => {
        const errors = Validators_1.default.validateRegex('checkNumbersAndLetters', '***testthis***', 'name');
        expect(errors.length).toEqual(1);
    });
});
describe('checkMinLengthNumber', () => {
    it('should accept numbers of a defined length in the parameters', () => {
        const errors = Validators_1.default.checkMinLengthNumber('5', '12345', 'number');
        expect(errors.length).toEqual(0);
    });
    it('should not accept numbers less than the defined length in the parameters', () => {
        const errors = Validators_1.default.checkMinLengthNumber('5', '1', 'number');
        expect(errors.length).toEqual(1);
    });
});
describe('validateEmptyAndSpaces', () => {
    it('should not allow empty spaces', () => {
        const result = Validators_1.default.validateEmptyAndSpaces('           ');
        expect(result.length).toBeGreaterThan(0);
    });
});
describe('checkLocationsWithoutOthersField', () => {
    it('should not allow empty spaces', () => {
        let result = Validators_1.default.checkLocationsWithoutOthersField('equal', 'equal');
        expect(result.length).toBeGreaterThan(0);
        result = Validators_1.default.checkLocationsWithoutOthersField('equal', 'not equal');
        expect(result.length).toEqual(0);
    });
});
describe('validateTravelFormSubmission', () => {
    it('should not allow empty spaces', () => {
        const payload = { pickup: 'equal', destination: '' };
        let result = index_1.default.validateTravelFormSubmission(payload);
        expect(result.length).toEqual(0);
        payload.flightNumber = ')(';
        payload.destination = 'equal';
        result = index_1.default.validateTravelFormSubmission(payload);
        expect(result.length).toBeGreaterThan(0);
    });
});
describe('validateTravelFormSubmission', () => {
    it('should not allow empty spaces', () => {
        const payload = { submission: { noOfPassengers: '', riderPhoneNo: '', travelTeamPhoneNo: '' } };
        const result = index_1.default.validateTravelContactDetails(payload);
        expect(result.length).toBeGreaterThan(0);
    });
});
describe('checkNumber', () => {
    it('should accept numbers', () => {
        const errors = Validators_1.default.validateRegex('checkNumber', '0', 'number');
        expect(errors.length).toEqual(0);
    });
    it('should not accept letters and special characters', () => {
        const errors = Validators_1.default.validateRegex('checkNumber', '***test***', 'number');
        expect(errors.length).toEqual(1);
    });
});
describe('UserInputValidator tests', () => {
    describe('checkWord', () => {
        it('should return an error when address contains special characters', () => {
            const errors = Validators_1.default.validateRegex('checkWord', '13, Androse road $$$');
            expect(errors.length).toEqual(1);
        });
        it('should return an empty array when address is good', () => {
            const errors = Validators_1.default.validateRegex('checkWord', '13, Androse road');
            expect(errors.length).toEqual(0);
        });
    });
    describe('checkOriginAnDestination', () => {
        it('should return errors when pickup and destination are NOT Others but are the same', () => {
            const errors = Validators_1.default.checkOriginAnDestination('Andela-Nairobi', 'Andela-Nairobi', 'pickupName', 'destinationName');
            expect(errors.length).toEqual(2);
        });
        it('should return errors when pickup and destination are NOT Others and NOT the same', () => {
            const errors = Validators_1.default.checkOriginAnDestination('Andela-Nairobi', 'Andela-Kigali', 'pickupName', 'destinationName');
            expect(errors.length).toEqual(0);
        });
    });
    describe('checkDate', () => {
        it('should return errors when date is less than now', () => {
            dateHelper_1.default.dateChecker = jest.fn(() => -20);
            const errors = Validators_1.default.checkDate('10/10/2018 22:00', 3600);
            expect(errors.length).toEqual(1);
        });
        it('should return an empty array when date is greater than now', () => {
            dateHelper_1.default.dateChecker = jest.fn(() => 20);
            const errors = Validators_1.default.checkDate('10/10/2050 22:00', 3600);
            expect(errors.length).toEqual(0);
        });
    });
    describe('checkDateTimeFormat', () => {
        it('should return errors when date is NOT in Day/Month/Year HH:MM format', () => {
            dateHelper_1.default.validateDateTime = jest.fn(() => false);
            const errors = Validators_1.default.checkDateTimeFormat('10/10/2018 22:00');
            expect(errors.length).toEqual(1);
        });
        it('should return an empty array when date is in Day/Month/Year HH:MM format', () => {
            dateHelper_1.default.validateDateTime = jest.fn(() => true);
            const errors = Validators_1.default.checkDateTimeFormat('10/10/2050 22:00');
            expect(errors.length).toEqual(0);
        });
    });
    describe('checkDateFormat', () => {
        it('should return errors when date is NOT in Month/Day/Year format', () => {
            const errors = Validators_1.default.checkDateFormat('10/33/2018');
            expect(errors.length).toEqual(1);
        });
        it('should return an empty array when date is in Day/Month/Year format', () => {
            const errors = Validators_1.default.checkDateFormat('10/10/2050');
            expect(errors.length).toEqual(0);
        });
    });
    describe('checkLocations', () => {
        it(`should return errors when a location is selected
      and the "Others" field is populated`, () => {
            const errors = index_1.default.checkLocations('Andela-Nairobi', '13, Androse road', 'pickup', 'others_pickup');
            expect(errors.length).toEqual(2);
        });
        it('should return error if a location is set to Others and the "Others" field is empty', () => {
            const errors = index_1.default.checkLocations('Others', '', 'pickup', 'others_pickup');
            expect(errors.length).toEqual(1);
        });
        it('should return an empty array if all is good', () => {
            const errors = index_1.default.checkLocations('Others', '13, Androse road', 'pickup', 'others_pickup');
            expect(errors.length).toEqual(0);
        });
    });
    describe('fetchUserInformationFromSlack', () => {
        it('should return user\'s slack profile information', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield index_1.default.fetchUserInformationFromSlack('dummyId');
            expect(user.real_name).toEqual('someName');
        }));
    });
    describe('UserInputValidator__validateSkipToPage', () => {
        it('should throw an error when the imputed value is not a number', () => {
            const payload = { submission: { pageNumber: 'test' } };
            const result = index_1.default.validateSkipToPage(payload);
            expect(result).toHaveProperty('errors');
        });
        it('should not throw an error if imputed value is a number ', () => {
            const payload = { submission: { pageNumber: 1 } };
            const result = index_1.default.validateSkipToPage(payload);
            expect(result).toBeUndefined();
        });
    });
    describe('validateLocationEntries', () => {
        it('should return location validation errors if they exist', () => {
            const payload = SlackInteractions_mock_1.createPayload();
            const errors = index_1.default.validateLocationEntries(payload);
            expect(errors.length).toEqual(0);
        });
    });
    describe('validateDateAndTimeEntry', () => {
        it('should return date validation errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            Validators_1.default.checkDate = jest.fn(() => []);
            Validators_1.default.checkDateTimeFormat = jest.fn(() => []);
            teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken = jest.fn(() => { });
            const payload = SlackInteractions_mock_1.createPayload();
            const errors = yield index_1.default.validateDateAndTimeEntry(payload);
            expect(errors.length).toEqual(0);
        }));
        it('should return Embassy date validation errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
            Validators_1.default.checkDate = jest.fn(() => []);
            Validators_1.default.checkDateTimeFormat = jest.fn(() => []);
            teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken = jest.fn(() => { });
            const payload = SlackInteractions_mock_1.createPayloadWithEmbassyTime();
            const errors = yield index_1.default.validateDateAndTimeEntry(payload);
            expect(errors.length).toEqual(0);
        }));
        it('should handle and throw errors within validateDateAndTimeEntry', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                index_1.default.fetchUserInformationFromSlack = jest.fn(() => Promise.reject());
                const payload = SlackInteractions_mock_1.createPayload();
                yield index_1.default.validateDateAndTimeEntry(payload);
                expect(index_1.default.fetchUserInformationFromSlack).toBeCalledWith(payload.user.id);
            }
            catch (e) {
                expect(e.message).toEqual('There was a problem processing your request');
            }
        }));
    });
    describe('compareDate', () => {
        it('invalid end date', () => {
            const result = managerFormValidator_1.default.compareDate('02/02/2019', '03/02/2018');
            expect(result[0].error).toEqual('End date cannot less than start date');
        });
    });
    describe('checkUsername', () => {
        it('valid user name', () => {
            const result = Validators_1.default.validateRegex('checkUsername', 'dummyUser', 'driver');
            expect(result.length).toEqual(0);
        });
        it('invalid username', () => {
            let result = Validators_1.default.validateRegex('checkUsername', '*****dummyUser*****', 'driver');
            expect(result.length).toEqual(1);
            result = Validators_1.default.validateRegex('checkUsername', null, 'driver');
            expect(result.length).toEqual(1);
        });
    });
    describe('validateSearchRoute', () => {
        it('should check against empty search sting', () => {
            const result = index_1.default.validateSearchRoute('    ');
            expect(result).toHaveProperty('errors');
        });
    });
    describe('validateStartRouteSubmission', () => {
        it('should call the UserInputValidator.validateSkipToPage method once', () => {
            const payload = SlackInteractions_mock_1.createPayload();
            const validateSkipToPageSpy = jest.spyOn(index_1.default, 'validateSkipToPage');
            index_1.default.validateStartRouteSubmission(payload);
            expect(validateSkipToPageSpy).toBeCalledTimes(1);
        });
        it('should call the UserInputValidator.validateSearchRoute method once', () => {
            const payload = SlackInteractions_mock_1.createPayload();
            const validateSearchRouteSpy = jest.spyOn(index_1.default, 'validateSearchRoute');
            index_1.default.validateStartRouteSubmission(payload);
            expect(validateSearchRouteSpy).toBeCalledTimes(1);
        });
    });
});
describe('checkPhoneNumber', () => {
    it('valid phone number', () => {
        const result = Validators_1.default.validateRegex('checkPhoneNumber', '23481234567', 'driver');
        expect(result.length).toEqual(0);
    });
    it('invalid phone number', () => {
        let result = Validators_1.default.validateRegex('checkPhoneNumber', '*****dummyUser*****', 'driver');
        expect(result.length).toEqual(1);
        result = Validators_1.default.validateRegex('checkPhoneNumber', '1233', 'driver');
        expect(result.length).toEqual(1);
        result = Validators_1.default.validateRegex('checkPhoneNumber', null, 'driver');
        expect(result.length).toEqual(1);
    });
});
describe('checkNumberPlate', () => {
    it('valid plate number', () => {
        let result = Validators_1.default.validateRegex('checkNumberPlate', 'LND 419 SMC', 'driver');
        expect(result.length).toEqual(0);
        result = Validators_1.default.validateRegex('checkNumberPlate', 'LND 419 smn', 'driver');
        expect(result.length).toEqual(0);
    });
    it('invalid plate number', () => {
        let result = Validators_1.default.validateRegex('checkNumberPlate', '*****Invalid Plate******', 'driver');
        expect(result.length).toEqual(1);
        result = Validators_1.default.validateRegex('checkNumberPlate', null, 'driver');
        expect(result.length).toEqual(1);
    });
});
describe('checkNumberPlate', () => {
    const payload = {
        submission: {
            driverName: 'Valid User',
            driverPhoneNo: '1234567890',
            regNumber: 'LND 419 smn',
            model: 'ferrari',
            capacity: '7'
        }
    };
    it('valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = index_1.default.validateCabDetails(payload);
        expect(result.length).toEqual(0);
    }));
    it('invalid', () => {
        payload.submission.regNumber = '*inalid reg number*';
        const result = index_1.default.validateCabDetails(payload);
        expect(result.length).toEqual(1);
    });
});
describe('test Validators class', () => {
    it('should not digit characters', () => {
        const result = Validators_1.default.validateRegex('checkNumber', 'aass', 'number');
        expect(result[0]).toHaveProperty('error', 'Only numbers are allowed. ');
    });
    it('should test empty fields', () => {
        const result = Validators_1.default.checkEmpty(' ', 'destination');
        expect(result[0]).toHaveProperty('error', 'This field cannot be empty');
    });
    it('should test not empty fields', () => {
        const result = Validators_1.default.checkEmpty('not empty ', 'destination');
        expect(result.length).toBeFalsy();
    });
    it('should test for special characters and return an empty array', () => {
        const result = Validators_1.default.validateRegex('checkNumbersAndLetters', '11221', 'phoneNo');
        expect(result).toEqual([]);
    });
    it('should test fields with white space', () => {
        const result = Validators_1.default.validateEmptyAndSpaces('aa ', 'destination');
        expect(result[0]).toHaveProperty('error', 'Spaces are not allowed');
    });
    it('should test if date is hours from now and return an error message', () => {
        const date = moment_1.default().add(1, 'hours');
        const result = Validators_1.default.checkDateTimeIsHoursAfterNow(2, date, 'flightTime');
        const expectedProps = ['error', 'flightTime must be at least 2 hours from current time.'];
        expect(result[0]).toHaveProperty(...expectedProps);
    });
    it('should test if date is hours from now and return an empty array', () => {
        const date = moment_1.default().add(4, 'hours');
        const result = Validators_1.default.checkDateTimeIsHoursAfterNow(2, date, 'flightTime');
        expect(result).toEqual([]);
    });
    it('should test validate Travel contact details', () => {
        const payload = {
            submission: {
                noOfPassengers: '34',
                riderPhoneNo: '23223',
                travelTeamPhoneNo: '4343sd'
            }
        };
        const result = index_1.default.validateTravelContactDetails(payload);
        expect(result[0]).toHaveProperty('error', 'Only numbers are allowed. ');
        expect(result[1]).toHaveProperty('error', 'Minimum length is 6 digits');
    });
});
describe('validateCoordinates', () => {
    const payload = {
        submission: {
            coordinates: 'PVM5+HR Nairobi, Kenya'
        }
    };
    it('is valid coordinates', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = index_1.default.validateCoordinates(payload);
        expect(result.length).toEqual(0);
    }));
    it('invalid', () => {
        payload.submission.coordinates = 'invalid coordinates';
        const result = index_1.default.validateCoordinates(payload);
        expect(result.length).toEqual(1);
    });
    describe('UserInputValidator_checkTimeFormat', () => {
        it('should respond with a message when an invalid time is passed', () => {
            const time = '08:A2';
            const res = Validators_1.default.checkTimeFormat(time, 'testField');
            const [SlackDialogError] = res;
            const { name, error } = SlackDialogError;
            expect(name).toEqual('testField');
            expect(error).toEqual('Invalid time');
        });
        it('should return an empty array when time is valid', () => {
            const time = '08:02';
            const res = Validators_1.default.checkTimeFormat(time, 'testField');
            expect(res).toEqual([]);
        });
    });
});
describe('validatePickupDestinationEntry', () => {
    it('should return location validation errors if they exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = SlackInteractions_mock_1.createPayload();
        index_1.default.validateDateAndTimeEntry = jest.fn().mockResolvedValue({ error: 'Yess !!!' });
        const date = moment_1.default().add(4, 'hours');
        const errors = yield index_1.default.validatePickupDestinationEntry(payload, 'pickup', 'flightTime', date, 2);
        expect(errors.length).toEqual(1);
        const otherErrors = yield index_1.default.validatePickupDestinationEntry(payload, 'otherErrors', 'flightTime', date, 2);
        expect(otherErrors.length).toEqual(0);
    }));
});
describe('validateApproveRoutesDetails', () => {
    const payData = {
        submission: {
            routeName: 'Kwetu', takeOffTime: '10:00'
        }
    };
    it('should return collected errors', () => {
        Validators_1.default.validateRegex = jest.fn().mockReturnValue([{ error: 'Yes error' }]);
        Validators_1.default.checkTimeFormat = jest.fn().mockReturnValue([{ error: 'Yes error' }]);
        const errors = index_1.default.validateApproveRoutesDetails(payData);
        expect(errors.length).toEqual(2);
    });
});
describe('validateEngagementForm', () => {
    const engagementFormData = { nameOfPartner: 'Tembea', workingHours: '10:00 - 11:00' };
    it('Should call Validators.isDateFormatValid', () => {
        Validators_1.default.isDateFormatValid = jest.fn().mockReturnValue(true);
        index_1.default.validateEngagementForm(engagementFormData);
        expect(Validators_1.default.isDateFormatValid).toHaveBeenCalledTimes(1);
        expect(Validators_1.default.isDateFormatValid).toHaveBeenCalledWith(engagementFormData.workingHours);
    });
});
describe('validateDialogBoxLocation', () => {
    it('should return collected errors if found in destination dialog box', () => {
        const errors = index_1.default.validateDialogBoxLocation();
        expect(errors.length).toEqual(1);
    });
});
describe('validatePickupDestinationLocationEntries', () => {
    const payData = SlackInteractions_mock_1.createPayload();
    it('should return collected errors if found in pickup dialog box', () => {
        index_1.default.validateDialogBoxLocation = jest.fn().mockReturnValue([{
                error: 'Yes error'
            }]);
        const errors = index_1.default.validatePickupDestinationLocationEntries(payData, 'pickup');
        expect(errors.length).toEqual(1);
    });
    it('should return collected errors if found in destination dialog box', () => {
        index_1.default.validateDialogBoxLocation = jest.fn().mockReturnValue([{
                error: 'Yes error'
            }]);
        Validators_1.default.checkOriginAnDestination = jest.fn().mockReturnValue([{
                error: 'Yes error'
            }]);
        const errors = index_1.default
            .validatePickupDestinationLocationEntries(payData, 'destination');
        expect(errors.length).toEqual(2);
    });
});
describe('checkDuplicatePhoneNo', () => {
    const payload = {
        submission: {
            riderPhoneNo: '0771239097',
            travelTeamPhoneNo: '0771239098'
        }
    };
    it('should check if the phoneNo is not duplicated', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = Validators_1.default.checkDuplicatePhoneNo(payload);
        expect(result.length).toEqual(0);
    }));
    it('should check if phoneNo is duplicated', () => __awaiter(void 0, void 0, void 0, function* () {
        payload.submission.riderPhoneNo = '0771239098';
        const result = Validators_1.default.checkDuplicatePhoneNo(payload);
        expect(result.length).toEqual(0);
    }));
});
//# sourceMappingURL=userInputValidator.spec.js.map