"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fonts = {
    fontLink: "@import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');",
    fontFamily: "font-family:'Roboto Mono', monospace;",
    inlineBlock: 'display: inline-block;',
};
const style = {
    tripDetailStyle: `padding: 5px;padding-left: 0;border-left: 5px solid #ced1dc;
  margin-top: 1.5rem;border-radius: 10px;background: #f7f7f7;`,
    ul: 'margin-left: 0px; padding-left: 0px;',
    li: `${fonts.fontLink} ${fonts.fontFamily} list-style: none;padding: 10px;border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;`,
    btn: `${fonts.fontLink} ${fonts.fontFamily} text-decoration: none!important;padding: 15px;border-radius: 8px;cursor: pointer;
  background: #3459db;color: #ffffff;width: 100px;font-size: 13px;border: 1px solid #3359db;`,
    firstItem: `${fonts.fontLink} width: 200px;color: #3359db;
  font-size: 12px;text-transform: capitalize;${fonts.fontFamily}${fonts.inlineBlock}`,
    secondItem: `${fonts.fontLink} margin-left: 20px; text-transform: capitalize;${fonts.fontFamily}${fonts.inlineBlock}`,
};
class MailTemplate {
    static getProviderTripNotificationTemplate(options) {
        const { name, url, tripDetails, timezone } = options;
        const { origin: { address: pickup }, destination: { address: destination }, rider: { name: passenger, phoneNo: passengerPhone }, departureTime, noOfPassengers, } = tripDetails;
        const template = `<table border="0">
      <tbody>
         <tr>
             <td>
                 <div style="margin-bottom: 10px;">
                     <img src="https://i.ibb.co/ysHj21F/logo.png" alt="logo" border="0"
                     style="width: 100px; margin-bottom: 20px; margin-top: 30px;">
                 </div>
             </td>
         </tr>
         <tr>
             <td>
                 <div style="${fonts.fontFamily}${fonts.fontFamily} margin-bottom: 1.5rem;">Dear <strong>${name}</strong></div>
             </td>
         </tr>
         <tr>
             <td>
                 <div style="${fonts.fontFamily}${fonts.fontFamily} margin-bottom: 0.2rem; font-size: 14px;">We hope this email finds you well.</div>
             </td>
         </tr>
         <tr>
             <td>
                 <div style="${fonts.fontFamily}${fonts.fontFamily} margin-bottom: 0.2rem; font-size: 14px;">Kindly assign an available cab and driver to the following trip.</div>
             </td>
         </tr>
         <tr>
             <td>
                 <div style="${style.tripDetailStyle}">
                   <ul style="${style.ul}">
                       <li style="${style.li}">
                         <div style="${style.firstItem}">Pick Up Location</div><div style="${style.secondItem}">${pickup}</div>
                       </li>
                       <li style="${style.li}"><div style="${style.firstItem}">Destination</div><div style="${style.secondItem}">${destination}</div>
                       </li>
                       <li style="${style.li}"><div style="${style.firstItem}">Passenger's Name</div><div style="${style.secondItem}">${passenger}</div>
                       </li>
                       <li style="${style.li}"><div style="${style.firstItem}">Passenger's Phone</div>
                       <div style="${style.secondItem}">${passengerPhone ? passengerPhone : 'N/A'}</div>
                       </li>
                       <li style="${style.li}">
                        <div style="${style.firstItem}">Additional Passengers</div>
                        <div style="${style.secondItem}">${Number(noOfPassengers - 1)}</div>
                       </li>
                       <li style="${style.li}"><div style="${style.firstItem}">TakeOff Time</div>
                        <div style="${style.secondItem}">
                          ${moment_timezone_1.default(departureTime, moment_timezone_1.default.ISO_8601).tz(timezone).format('MMMM Do, YYYY HH:mm')}
                        </div>
                       </li>
                   </ul>
                 </div>
             </td>
         </tr>
         <tr>
             <td><div style="height: 80px; margin-top: 40px;">
               <a href="${url}" style="${style.btn}">Confirm Trip</a></div>
             </td></tr>
         <tr>
             <td>
                 <div style="${fonts.fontLink} ${fonts.fontFamily}margin-bottom: 1.5rem; margin-top: 0.2rem">Sincerely,</div>
             </td>
         </tr>
         <tr><td><div style="${fonts.fontLink} ${fonts.fontFamily}">Tembea Team.</div></td></tr>
     </tbody>
 </table>
        `;
        return template;
    }
}
exports.MailTemplate = MailTemplate;
//# sourceMappingURL=email.template.js.map