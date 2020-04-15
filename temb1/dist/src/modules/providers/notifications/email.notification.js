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
const EmailService_1 = __importDefault(require("../../emails/EmailService"));
const environment_1 = __importDefault(require("../../../config/environment"));
const email_template_1 = require("../../../helpers/email/email.template");
const base_notification_1 = require("./base.notification");
const dateHelpers_1 = require("../../slack/helpers/dateHelpers");
const trip_request_1 = require("../../../database/models/trip-request");
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
class EmailNotification extends base_notification_1.BaseNotification {
    constructor(email = new EmailService_1.default(), trips = trip_service_1.default) {
        super();
        this.email = email;
        this.trips = trips;
    }
    sendVerificationMessage(provider, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailOptions = {
                from: `Tembea <${environment_1.default.TEMBEA_EMAIL_ADDRESS}>`,
                to: provider.email,
                subject: 'Tembea: Email Verification',
                html: this.getVerificationTemplate(provider, options.origin),
            };
            yield this.email.sendMail(emailOptions);
        });
    }
    notifyNewTripRequest(provider, tripDetails, teamDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const templateInfo = {
                tripDetails,
                url: this.getTripApprovalUrl({
                    teamId: teamDetails.teamId,
                    tripId: tripDetails.id,
                    providerId: provider.id,
                }),
                name: provider.name,
                timezone: dateHelpers_1.getTimezone(tripDetails.homebase.name),
            };
            const data = {
                from: `Tembea <${environment_1.default.TEMBEA_EMAIL_ADDRESS}>`,
                to: provider.email,
                subject: 'Trip Reminder',
                html: email_template_1.MailTemplate.getProviderTripNotificationTemplate(templateInfo),
            };
            const trip = yield this.trips.getById(tripDetails.id, true);
            if (trip.tripType === trip_request_1.TripTypes.airportTransfer || trip.tripType === trip_request_1.TripTypes.embassyVisit) {
                data.cc = trip.homebase.travelEmail;
            }
            yield this.email.sendMail(data);
        });
    }
    getVerificationTemplate(provider, origin) {
        return `<div style="background:#edf4f7;padding:50px 0;font-family: 'Ubuntu', sans-serif;">
        <div style="width:96%;max-width:500px;padding:2%;margin:0 auto;border:1px solid #d3dbe6;border-radius:5px;display:block;background:#ffffff">
          <h1>Verify your email</h1>
          <div>Dear <b>${provider.name}</b>,
              <br />
              <br>
          </div>
          <div>
              There is one quick step you need to complete to verify your email on <b>Tembea</b>. Let us make sure this is the right email address for you, please confirm this by clicking on the link below.
          </div>
          <div style="padding:20px 0;margin: 20px 0">
              <a style="padding:10px 30px;text-decoration:none;border-radius:25px;background:#2c60db;color:#ffffff" href='${origin}/provider/${this.generateToken({ id: provider.id })}'>Verify now</a>
          </div>
          <div style="padding:10px 0">
              This verification link expires after three day.
          </div>
          <div>Thanks,
              <br/> <b>Tembea</b></div>
        </div>
      </div>
      `;
    }
}
exports.EmailNotification = EmailNotification;
//# sourceMappingURL=email.notification.js.map