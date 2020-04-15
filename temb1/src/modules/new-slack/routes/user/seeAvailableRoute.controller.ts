import SeeAvailaibleRouteHelpers from './seeAvailableRoute.helpers';
import { homebaseService } from '../../../homebases/homebase.service';
import { routeBatchService } from '../../../routeBatches/routeBatch.service';
import { IModalResponse } from '../../helpers/modal.router';
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import PaginationHelpers from '../../helpers/pagination-helpers';

export default class SeeAvailableRouteController {
  static async seeAvailableRoutes(payload: any, respond: Function) {
    const where = { status: 'Active' };
    const message = await SeeAvailableRouteController.getAllRoutes(payload, where);
    respond(message);
  }

  static async getAllRoutes(payload: any, where: any) {
    const page = PaginationHelpers.getPageNumber(payload);
    const homebase = await homebaseService.getHomeBaseBySlackId(payload.user.id);
    const result = await routeBatchService.getPagedAvailableRouteBatches(homebase.id, page, where);
    const message = await SeeAvailaibleRouteHelpers.getAvailableRoutesBlockMessage(result);
    return message;
  }

  static async searchRoute(payload: any) {
    const { response_url: state } = payload;
    await SeeAvailaibleRouteHelpers.popModalForSeachRoute(payload, state);
  }

  static async handleSearchRoute(payload: any, submission: any, respond: IModalResponse) {
    try {
      const where = { status: 'Active', name: submission.routeName };
      const message = await SeeAvailableRouteController.getAllRoutes(payload, where);
      respond.clear();
      const url = JSON.parse(payload.view.private_metadata);
      await UpdateSlackMessageHelper.sendMessage(url, message);
    } catch (error) {
      respond.error(error.errors);
    }
  }

  static async skipPage(payload: any) {
    const { response_url: state } = payload;
    await SeeAvailaibleRouteHelpers.popModalForSkipPage(payload, state);
  }

  static async handleSkipPage(payload: any, submission: any, respond: IModalResponse) {
    try {
      const data = {
        team: { id: payload.team.id, domain: payload.team.domain },
        user: { id: payload.user.id, name: payload.user.name, team_id: payload.team.id },
        actions: [
          {
            action_id: `user_route_page_${submission.pageNumber}`,
            block_id: 'user_route_pagination',
            value: `availableRoutes_page_${submission.pageNumber}`,
          },
        ],
      };
      respond.clear();
      const where = { status: 'Active' };
      const message = await SeeAvailableRouteController.getAllRoutes(data, where);
      const url = JSON.parse(payload.view.private_metadata);
      await UpdateSlackMessageHelper.sendMessage(url, message);
    } catch (error) {
      respond.error(error.errors);
    }
  }
}
