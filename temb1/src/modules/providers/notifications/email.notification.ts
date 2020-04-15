import { IProviderNotification, IProvider } from './notification.interface';
import EmailService from '../../emails/EmailService';
import environment from '../../../config/environment';
import { MailTemplate } from '../../../helpers/email/email.template';
import { BaseNotification } from './base.notification';
import { getTimezone } from '../../slack/helpers/dateHelpers';
import { TripTypes } from '../../../database/models/trip-request';
import tripService from '../../trips/trip.service';
export class EmailNotification extends BaseNotification implements IProviderNotification {
  constructor(private readonly email = new EmailService(),
    private readonly trips = tripService,
  ) {
    super();
  }
  async sendVerificationMessage(provider: IProvider, options: any): Promise<void> {
    const emailOptions = {
      from: `Tembea <${environment.TEMBEA_EMAIL_ADDRESS}>`,
      to: provider.email,
      subject: 'Tembea: Email Verification',
      html: this.getVerificationTemplate(provider, options.origin),
    };
    await this.email.sendMail(emailOptions);
  }
  async notifyNewTripRequest(provider: IProvider,
     tripDetails: any, teamDetails: any): Promise<void> {
    const templateInfo = {
      tripDetails,
      url: this.getTripApprovalUrl({
        teamId: teamDetails.teamId,
        tripId: tripDetails.id,
        providerId: provider.id,
      }),
      name: provider.name,
      timezone: getTimezone(tripDetails.homebase.name),
    };
    const data: any = {
      from: `Tembea <${environment.TEMBEA_EMAIL_ADDRESS}>`,
      to: provider.email,
      subject: 'Trip Reminder',
      html: MailTemplate.getProviderTripNotificationTemplate(templateInfo),
    };
    const trip = await this.trips.getById(tripDetails.id, true);
    if (trip.tripType === TripTypes.airportTransfer || trip.tripType === TripTypes.embassyVisit) {
      data.cc = trip.homebase.travelEmail;
    }
    await this.email.sendMail(data);
  }
  private getVerificationTemplate(provider: IProvider, origin: string)  {
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
