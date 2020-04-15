"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackDialogModels_1 = require("../../../modules/slack/SlackModels/SlackDialogModels");
const data_1 = require("../../../utils/data");
exports.toLabelValuePairs = (arr) => arr.map((val) => ({
    label: val,
    value: val
}));
const addressHint = 'e.g: Jomo Kenyatta Airport';
exports.dateHint = `Enter date in Day/Month/Year format,
    leave a space and enter time in Hour:Minutes format. e.g 22/12/2019 22:00`;
const createTripDetailsForm = {
    regularTripForm: (defaultNote, locations) => {
        const pickupField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Pickup location', 'pickup', exports.toLabelValuePairs(locations));
        const othersPickupField = new SlackDialogModels_1.SlackDialogText('Others?', 'othersPickup', 'Enter pickup location', true);
        const dateField = new SlackDialogModels_1.SlackDialogText('Date and Time', 'dateTime', 'dd/mm/yy hh:mm', false, exports.dateHint);
        return [
            dateField,
            pickupField,
            othersPickupField,
        ];
    },
    tripDestinationLocationForm: (defaultNote, locations) => {
        const destinationField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Destination', 'destination', exports.toLabelValuePairs(locations));
        const othersDestinationField = new SlackDialogModels_1.SlackDialogText('Others?', 'othersDestination', 'Enter destination', true);
        return [
            destinationField,
            othersDestinationField,
        ];
    },
    travelTripContactDetailsForm: () => {
        const forWho = new SlackDialogModels_1.SlackDialogElementWithDataSource('For Who?', 'rider');
        const noOfPassengers = new SlackDialogModels_1.SlackDialogText('Number of Passengers', 'noOfPassengers', 'Enter the total number of passengers', false, 'e.g 2');
        const riderPhoneNo = new SlackDialogModels_1.SlackDialogText('Passenger phone number', 'riderPhoneNo', 'Enter Passenger\'s phone number', false, 'e.g 0717665593');
        const travelTeamPhoneNo = new SlackDialogModels_1.SlackDialogText('Travel team phone number', 'travelTeamPhoneNo', 'Enter travel team phone number', false, 'e.g 0717665593');
        return [
            forWho,
            noOfPassengers,
            riderPhoneNo,
            travelTeamPhoneNo
        ];
    },
    travelTripFlightDetailsForm: (defaultNote, locations) => {
        const flightNumber = new SlackDialogModels_1.SlackDialogText('Flight Number', 'flightNumber', 'Enter flight number', false);
        const flightDateTime = new SlackDialogModels_1.SlackDialogText('Flight Date and Time', 'flightDateTime', 'dd/mm/yy hh:mm', false, exports.dateHint);
        const pickupField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Pickup location', 'pickup', exports.toLabelValuePairs([...locations, ...data_1.extraTravelOptions]));
        const pickupFieldOther = new SlackDialogModels_1.SlackDialogText('Other Pickup location', 'othersPickup', 'Enter pickup location', true, addressHint);
        return [
            flightNumber,
            flightDateTime,
            pickupField,
            pickupFieldOther
        ];
    },
    travelDestinationForm: (defaultNote, locations) => {
        const destinationField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Destination', 'destination', exports.toLabelValuePairs(locations));
        const destinationFieldOther = new SlackDialogModels_1.SlackDialogText('Other Destination', 'othersDestination', 'Enter destination', true, addressHint);
        return [
            destinationField,
            destinationFieldOther
        ];
    },
    travelEmbassyDetailsForm: (defaultNote, addresses, payload) => {
        const pickupField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Pickup location', 'pickup', exports.toLabelValuePairs(data_1.extraTravelOptions));
        const destinationField = new SlackDialogModels_1.SlackDialogSelectElementWithOptions('Destination', 'destination', exports.toLabelValuePairs(payload.homeBaseEmbassies.map((item) => item.name)));
        const appointmentDateTime = new SlackDialogModels_1.SlackDialogText('Interview Date and Time', 'embassyVisitDateTime', 'dd/mm/yy hh:mm', false, exports.dateHint);
        const textarea = new SlackDialogModels_1.SlackDialogTextarea('Reason', 'reason', 'Enter reason for booking the trip');
        return [
            pickupField,
            destinationField,
            appointmentDateTime,
            textarea
        ];
    },
    travelTripNoteForm: (state) => {
        const textarea = new SlackDialogModels_1.SlackDialogTextarea('Add Trip Note', 'tripNote', 'Add Trip Notes', 'Eg. I always travel in First Class', state || ' ');
        return [
            textarea
        ];
    },
    riderLocationConfirmationForm: () => {
        const confirmedLocation = new SlackDialogModels_1.SlackDialogText('Riders location', 'confirmedLocation', 'Enter location', false, 'e.g Mirema Nairobi');
        return [
            confirmedLocation
        ];
    }
};
exports.default = createTripDetailsForm;
//# sourceMappingURL=index.js.map