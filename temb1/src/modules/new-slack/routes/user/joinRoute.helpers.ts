import { SlackText, MarkdownText, Block, ButtonElement, BlockTypes,
    BlockMessage, ActionBlock, SectionBlock, Modal, InputBlock, TextInput,
    SelectElement, ElementTypes, ImageBlock,
  } from '../../models/slack-block-models';
import userRouteActions from '../actions';
import userRouteBlocks from '../blocks';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import { SlackViews } from '../../extensions/SlackViews';
import Utils from '../../../../utils/index';
import moment from 'moment';
import DateDialogHelper from '../../../../helpers/dateHelper';
import { timeTo12hrs } from '../../../slack/helpers/dateHelpers';
import { joinRouteRequestService } from '../../../joinRouteRequests/joinRouteRequest.service';
import UserService from '../../../users/user.service';
import { routeService } from '../../../routes/route.service';
import { engagementService } from '../../../engagements/engagement.service';
import { getFellowEngagementDetails } from '../../../slack/helpers/formHelper';
import { slackEventNames } from '../../../slack/events/slackEvents';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import SlackEvents from '../../../slack/events/index';
import Cache from '../../../shared/cache';
import { partnerService } from '../../../partners/partner.service';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import { routeBatchService } from '../../../routeBatches/routeBatch.service';

class JoinRouteHelpers {
  static async joinRouteModal(payload: any, state: any) {
    const selectManager = new InputBlock(
      new SelectElement(ElementTypes.userSelect, 'Select Manager', 'manager'),
      'Select Manager', 'manager',
    );
    const workHours = new InputBlock(new TextInput('18:00 - 00:00', 'workHours'),
    'Work hours', 'workHours', false, 'hh:mm E.g. 18:00 - 00:00');
    const modal = Modal.createModal({
      modalTitle: 'Enter your details',
      modalOptions: {
        submit: 'Submit',
        close: 'Cancel',
      },
      inputBlocks: [selectManager, workHours],
      callbackId: userRouteActions.selectManagerSubmit,
      metadata: JSON.stringify(state),
    });
    const token = await teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return SlackViews.getSlackViews(token).open(payload.trigger_id, modal);
  }

  static async confirmRouteBlockMessage(tempJoinRoute: any) {
    const headerText = new MarkdownText('*Please confirm these details*');
    const heading = new Block().addText(headerText);
    const detailsBlock = await JoinRouteHelpers.joinRouteBlock(tempJoinRoute);
    const confirmButton = [new ButtonElement(new SlackText('Confirm details'),
          'submitJoinRoute', userRouteActions.confirmJoining, SlackActionButtonStyles.primary)];
    const action = new ActionBlock(userRouteBlocks.confirmRoute);
    action.addElements(confirmButton);
    const navBlock = NewSlackHelpers.getNavBlock(userRouteBlocks.availableRoutes,
          userRouteActions.showAvailableRoutes, 'join_route_showAvailableRoutes');
    const message = new BlockMessage([heading, ...detailsBlock, action, navBlock]);
    return message;
  }

  static async joinRouteBlock(joinRoute: any) {
    const { routeBatch, routeBatch: { route: { imageUrl } } } = joinRoute;
    const imageBlock = new ImageBlock('Map route', imageUrl, 'Map route');
    const fellowFields = await JoinRouteHelpers.engagementFields(joinRoute);
    const routeBatchFields = await JoinRouteHelpers.routeFields(routeBatch);
    const divider = new Block(BlockTypes.divider);
    const eng =  new Block().addText(new MarkdownText('*_`Engagement Details`_*'));
    const routeInfo = new Block().addText(new MarkdownText('*_`Route Information`_*'));
    return [divider, eng, fellowFields, divider, routeInfo, routeBatchFields, divider, imageBlock];
  }

  static engagementFields(joinRequest: any) {
    const { manager: { email, name } } = joinRequest;
    const managerName = Utils.getNameFromEmail(email) || name;
    const managerField = new SectionBlock();
    const fields = JoinRouteHelpers.engagementBlockFields(joinRequest);
    managerField.addFields([
      new MarkdownText(`*Line Manager:* ${managerName} (@${name})`),
      ...fields,
    ]);
    return managerField;
  }

  static engagementBlockFields(routeRequest: any) {
    const {fellow, workHours, partnerName,
      startDate, endDate} = JoinRouteHelpers.destructEngagementDetails(routeRequest);
    const { email, name } = fellow;
    const fellowName = Utils.getNameFromEmail(email) || name;
    const { from, to } = Utils.formatWorkHours(workHours);
    const engagementDateFields = JoinRouteHelpers.engagementDateFields(startDate, endDate);
    const detailedField = [
      new MarkdownText(`*Fellows Name*: ${fellowName}`),
      new MarkdownText(`*Partner*: ${partnerName}`),
      new MarkdownText('*Work Hours*'),
      new MarkdownText(`*_From:_* ${from}`),
      new MarkdownText(`*_To:_* ${to}`),
      ...engagementDateFields,
    ];
    return detailedField;
  }

  static engagementDateFields(startDate: any, endDate: any) {
    let result;
    if (startDate && startDate.charAt(2) === '/') {
      result = JoinRouteHelpers.formatStartAndEndDates(startDate, endDate);
    }
    if (startDate && endDate) {
      const sdDate = result ? moment(new Date(result.startDate)) : moment(new Date(startDate));
      const edDate = result ? moment(new Date(result.endDate)) : moment(new Date(endDate));
      const format = 'Do MMMM YYYY';
      const edFormatted = edDate.format(format);
      const sdFormatted = sdDate.format(format);
      const fields = [
        new MarkdownText('*Engagement Period*'),
        new MarkdownText(`*_Start Date_*: ${sdFormatted}`),
        new MarkdownText(`*_End Date_*: ${edFormatted}`),
      ];
      return fields;
    }
  }

  static joinRouteHandleRestrictions(user: any, engagement: any) {
    if (!engagement) {
      return new SlackText(`Sorry! It appears you are not on any engagement at the moment.
        If you believe this is incorrect, contact Tembea Support.`,
      );
    }
    if (user.routeBatchId) {
      return new SlackText('You are already on a route. Cannot join another');
    }
  }

  static formatStartAndEndDates(startDate: any, endDate: any) {
    const engagementDates = { startDate, endDate };
    return DateDialogHelper.convertIsoString(engagementDates);
  }

  static routeFields(route: any) {
    const { capacity, takeOff, route: { name: routeName, destination: { address } } } = route;
    const takeOffTime = timeTo12hrs(takeOff);
    const routeFields = new SectionBlock;
    return routeFields.addFields([
      new MarkdownText(`*Route*: ${routeName}`),
      new MarkdownText(`*Route capacity*: ${route.inUse}/${capacity}`),
      new MarkdownText(`*Route Departure Time*: ${takeOffTime}`),
      new MarkdownText(`*Bus Stop:*  :busstop: ${address}`),
    ]);
  }

  static destructEngagementDetails(routeRequest: any) {
    const { engagement } = routeRequest;
    const { partner: { name: partnerName }, fellow, startDate, endDate, workHours } = engagement;
    return { partnerName, fellow, startDate, endDate, workHours };
  }

  static async notifyJoiningRouteMessage(payload: any, tempJoinRoute: any) {
    try {
      const { user: { id }, team: { id: teamId } } = payload;
      const { routeBatch: { id: routeId, capacity, inUse } } = tempJoinRoute;
      const usedData = { id, routeId, teamId, capacity, inUse };
      const capacityFilled = JoinRouteHelpers.checkFilledCapacity(usedData);
      if (capacityFilled) {
        SlackEvents.raise(...capacityFilled);
        return new SlackText('Someone from the Ops team will reach out to you shortly.');
      }
      const eventArgs = await JoinRouteHelpers.joinNotFilledCapacity(payload, tempJoinRoute);
      SlackEvents.raise(...eventArgs);
      return new SlackText(`Hey <@${id}> :smiley:, request has been received`);
    } catch (error) {
      bugsnagHelper.log(error);
      return new SlackText('Sorry, something went wrong. Please try again');
    }
  }

  static checkFilledCapacity(usedData: any) {
    const { id, routeId, teamId, capacity, inUse } = usedData;
    let eventArgs;
    if (capacity === inUse) {
      eventArgs = [
        slackEventNames.OPS_FILLED_CAPACITY_ROUTE_REQUEST,
        { routeId, teamId, requesterSlackId: id },
      ];
    }
    return eventArgs;
  }

  static async joinNotFilledCapacity(payload: any, tempJoinRoute: any) {
    const { user: { id }, team: { id: teamId } } = payload;
    const { routeBatch: { id: routeId }, engagement: { workHours } } = tempJoinRoute;
    const { id: joinId, managerId, engagementId, routeBatchId,
    } = await JoinRouteHelpers.saveJoinRouteRequest(payload, routeId);
    await joinRouteRequestService.updateJoinRouteRequest(joinId, {
      id: joinId, status: 'Confirmed',  engagement: { engagementId },
      manager: { managerId }, routeBatch: { routeBatchId } });
    const user = await UserService.getUserBySlackId(id);
    const engagement = await getFellowEngagementDetails(id, teamId);
    const { startDate, endDate } = engagement;
    await engagementService.updateEngagement(engagementId, { startDate, endDate, workHours });
    await routeService.addUserToRoute(routeId, user.id);
    const eventArgs = [slackEventNames.MANAGER_RECEIVE_JOIN_ROUTE, payload, joinId];
    return eventArgs;
  }

  static async saveJoinRouteRequest(payload: any, routeBatchId: number) {
    const { user: { id: slackId }, team: { id: teamId } } = payload;
    const { manager: managerSlackId, workHours,
    } = await Cache.fetch(`joinRouteRequestSubmission_${slackId}`);
    const result = await Cache.fetch(`userDetails${slackId}`);
    const engagementDates = { startDate: result[0], endDate: result[1] };
    const partnerName = result[2];
    const { startDate, endDate } = DateDialogHelper.convertIsoString(engagementDates);
    const [partner, fellow, manager, routeBatch] = await Promise.all([
      partnerService.findOrCreatePartner(partnerName),
      SlackHelpers.findOrCreateUserBySlackId(slackId, teamId),
      SlackHelpers.findOrCreateUserBySlackId(managerSlackId),
      routeBatchService.getRouteBatchByPk(routeBatchId),
    ]);
    const engagement = await engagementService.findOrCreateEngagement(
      workHours, fellow, partner, startDate, endDate,
    );
    return joinRouteRequestService.createJoinRouteRequest(
      engagement.id, manager.id, routeBatch.id,
    );
  }
}

export default JoinRouteHelpers;
