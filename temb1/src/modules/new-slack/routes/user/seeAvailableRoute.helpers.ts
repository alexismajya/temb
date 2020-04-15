import { SlackText, MarkdownText, Block, ButtonElement, BlockTypes,
    BlockMessage, ActionBlock, SectionBlock, Modal, InputBlock, TextInput,
  } from '../../models/slack-block-models';
import userRouteActions from '../actions';
import userRouteBlocks from '../blocks';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import { PagedResult } from '../../../shared/base.service';
import { RouteBatch } from '../../../../database';
import { SlackViews } from '../../extensions/SlackViews';
import PaginationHelpers from '../../helpers/pagination-helpers';

class SeeAvailaibleRouteHelpers {
  static async getAvailableRoutesBlockMessage(routeBatchData: PagedResult<RouteBatch>) {
    const headerText = new MarkdownText('*All Available Routes:slightly_smiling_face:*');
    const header = new Block().addText(headerText);
    if (!routeBatchData.data.length) {
      return new SlackText('Sorry, route not available at the moment :disappointed:');
    }
    const mainBlocks = routeBatchData.data.map((route: any) =>
      SeeAvailaibleRouteHelpers.routeBlock(route));
    const divider = new Block(BlockTypes.divider);
    const flattened = mainBlocks.map((block: any) => [...block, divider])
        .reduce((a: any, b: any) => a.concat(b));
    // add pagination buttons if total routes exceeds page limit
    const paginationBlock = PaginationHelpers.addPaginationButtons(routeBatchData,
      'availableRoutes', userRouteActions.page, userRouteBlocks.pagination,
      userRouteActions.skipPage);
    if (paginationBlock) {
      flattened.push(...paginationBlock);
    }
    const searchBtnBlock = NewSlackHelpers.searchButton(userRouteActions.searchPopup,
    userRouteBlocks.searchRouteBlock);
    const navBlock = NewSlackHelpers.getNavBlock(userRouteBlocks.navBlock,
        userRouteActions.back, 'back_to_routes_launch');
    const blocks = [header, divider, ...flattened, searchBtnBlock, navBlock];
    const message = new BlockMessage(blocks);
    return message;
  }

  static routeBlock(routesInfo: RouteBatch) {
    const {
      id: batchId, takeOff: departureTime,
      cabDetails: { capacity, regNumber }, batch, route, riders,
    } = routesInfo;

    const heading = new SectionBlock();
    const routeString = `*Route: ${route.name}*`;
    const takeOffTime = `Departure Time: ${departureTime}`;
    const availablePassenger = `*Available Passengers: ${riders.length}*`;
    const cabCapacity = `Cab Capacity: ${capacity || 'N/A'} `;
    const routeDriverName = `Cab Registration Number: ${regNumber || 'N/A'} `;
    const cabBatch = `*Batch: ${batch}*`;

    heading.addFields([
      new MarkdownText(routeString),  new SlackText(takeOffTime),
      new MarkdownText(cabBatch),  new SlackText(routeDriverName),
      new MarkdownText(availablePassenger),  new SlackText(cabCapacity),
    ]);

    const joinRouteBtn = [new ButtonElement(new SlackText('Join Route'), String(batchId),
      `${userRouteActions.userJoinRoute}_${batchId}`, SlackActionButtonStyles.primary)];
    const action = new ActionBlock(`${userRouteBlocks.joinRouteBlock}_${batchId}`);
    action.addElements(joinRouteBtn);

    return [heading, action];
  }

  static async popModalForSeachRoute(payload: any, state: string) {
    const search = new InputBlock(new TextInput('Enter the route name to search', 'routeName'), 'Search', 'routeName', false, 'eg Emmerich Road');
    const modal = Modal.createModal({
      modalTitle: 'Search',
      modalOptions: {
        submit: 'Submit',
        close: 'Cancel',
      },
      inputBlocks: [search],
      callbackId: userRouteActions.searchRouteSubmit,
      metadata: JSON.stringify(state),
    });
    const token = await teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return SlackViews.getSlackViews(token).open(payload.trigger_id, modal);
  }

  static async popModalForSkipPage(payload: any, state: string) {
    const skipPage = new InputBlock(new TextInput('Page to skip to', 'pageNumber'),
    'Page Number', 'pageNumber', false, 'eg: 2');
    const modal = Modal.createModal({
      modalTitle: 'Page to skip to',
      modalOptions: {
        submit: 'Submit',
        close: 'Cancel',
      },
      inputBlocks: [skipPage],
      callbackId: userRouteActions.skipPageSubmit,
      metadata: JSON.stringify(state),
    });
    const token = await teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return SlackViews.getSlackViews(token).open(payload.trigger_id, modal);
  }
}

export default SeeAvailaibleRouteHelpers;
