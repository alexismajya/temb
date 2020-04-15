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
const slack_block_models_1 = require("../../models/slack-block-models");
const actions_1 = __importDefault(require("../actions"));
const blocks_1 = __importDefault(require("../blocks"));
const SlackMessageModels_1 = require("../../../slack/SlackModels/SlackMessageModels");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const SlackViews_1 = require("../../extensions/SlackViews");
const pagination_helpers_1 = __importDefault(require("../../helpers/pagination-helpers"));
class SeeAvailaibleRouteHelpers {
    static getAvailableRoutesBlockMessage(routeBatchData) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerText = new slack_block_models_1.MarkdownText('*All Available Routes:slightly_smiling_face:*');
            const header = new slack_block_models_1.Block().addText(headerText);
            if (!routeBatchData.data.length) {
                return new slack_block_models_1.SlackText('Sorry, route not available at the moment :disappointed:');
            }
            const mainBlocks = routeBatchData.data.map((route) => SeeAvailaibleRouteHelpers.routeBlock(route));
            const divider = new slack_block_models_1.Block(slack_block_models_1.BlockTypes.divider);
            const flattened = mainBlocks.map((block) => [...block, divider])
                .reduce((a, b) => a.concat(b));
            const paginationBlock = pagination_helpers_1.default.addPaginationButtons(routeBatchData, 'availableRoutes', actions_1.default.page, blocks_1.default.pagination, actions_1.default.skipPage);
            if (paginationBlock) {
                flattened.push(...paginationBlock);
            }
            const searchBtnBlock = slack_helpers_1.default.searchButton(actions_1.default.searchPopup, blocks_1.default.searchRouteBlock);
            const navBlock = slack_helpers_1.default.getNavBlock(blocks_1.default.navBlock, actions_1.default.back, 'back_to_routes_launch');
            const blocks = [header, divider, ...flattened, searchBtnBlock, navBlock];
            const message = new slack_block_models_1.BlockMessage(blocks);
            return message;
        });
    }
    static routeBlock(routesInfo) {
        const { id: batchId, takeOff: departureTime, cabDetails: { capacity, regNumber }, batch, route, riders, } = routesInfo;
        const heading = new slack_block_models_1.SectionBlock();
        const routeString = `*Route: ${route.name}*`;
        const takeOffTime = `Departure Time: ${departureTime}`;
        const availablePassenger = `*Available Passengers: ${riders.length}*`;
        const cabCapacity = `Cab Capacity: ${capacity || 'N/A'} `;
        const routeDriverName = `Cab Registration Number: ${regNumber || 'N/A'} `;
        const cabBatch = `*Batch: ${batch}*`;
        heading.addFields([
            new slack_block_models_1.MarkdownText(routeString), new slack_block_models_1.SlackText(takeOffTime),
            new slack_block_models_1.MarkdownText(cabBatch), new slack_block_models_1.SlackText(routeDriverName),
            new slack_block_models_1.MarkdownText(availablePassenger), new slack_block_models_1.SlackText(cabCapacity),
        ]);
        const joinRouteBtn = [new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Join Route'), String(batchId), `${actions_1.default.userJoinRoute}_${batchId}`, SlackMessageModels_1.SlackActionButtonStyles.primary)];
        const action = new slack_block_models_1.ActionBlock(`${blocks_1.default.joinRouteBlock}_${batchId}`);
        action.addElements(joinRouteBtn);
        return [heading, action];
    }
    static popModalForSeachRoute(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const search = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Enter the route name to search', 'routeName'), 'Search', 'routeName', false, 'eg Emmerich Road');
            const modal = slack_block_models_1.Modal.createModal({
                modalTitle: 'Search',
                modalOptions: {
                    submit: 'Submit',
                    close: 'Cancel',
                },
                inputBlocks: [search],
                callbackId: actions_1.default.searchRouteSubmit,
                metadata: JSON.stringify(state),
            });
            const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return SlackViews_1.SlackViews.getSlackViews(token).open(payload.trigger_id, modal);
        });
    }
    static popModalForSkipPage(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const skipPage = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('Page to skip to', 'pageNumber'), 'Page Number', 'pageNumber', false, 'eg: 2');
            const modal = slack_block_models_1.Modal.createModal({
                modalTitle: 'Page to skip to',
                modalOptions: {
                    submit: 'Submit',
                    close: 'Cancel',
                },
                inputBlocks: [skipPage],
                callbackId: actions_1.default.skipPageSubmit,
                metadata: JSON.stringify(state),
            });
            const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
            return SlackViews_1.SlackViews.getSlackViews(token).open(payload.trigger_id, modal);
        });
    }
}
exports.default = SeeAvailaibleRouteHelpers;
//# sourceMappingURL=seeAvailableRoute.helpers.js.map