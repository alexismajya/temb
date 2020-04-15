"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slack_block_models_1 = require("../models/slack-block-models");
class PaginationHelpers {
    static getPageNumber(payload) {
        let pageNumber;
        if (payload.actions) {
            const buttonName = payload.actions[0].value;
            const tempPageNo = buttonName.includes('page')
                ? Number(buttonName.split('_')[2])
                : 1;
            pageNumber = tempPageNo || 1;
        }
        return pageNumber;
    }
    static addPaginationButtons(routes, routeNote, pageAction, userPaginationBlock, skipPageAction) {
        let paginationBlock;
        if (routes.pageMeta.totalPages > 1) {
            paginationBlock = PaginationHelpers.createPaginationBlock(userPaginationBlock, routeNote, routes.pageMeta.page, routes.pageMeta.totalPages, pageAction, skipPageAction);
        }
        return paginationBlock;
    }
    static createPaginationBlock(blockId, value, pageNumber, noOfPages, pageAction, skipPageAction) {
        const paginationHeader = new slack_block_models_1.MarkdownText(`Page ${pageNumber} of ${noOfPages}`);
        const header = new slack_block_models_1.Block().addText(paginationHeader);
        const buttonGenerator = [{ text: '< Prev', incr: -1 }, { text: 'Next >', incr: 1 }];
        const [prevPageButton, nextPageButton] = buttonGenerator.map((v) => new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText(v.text), `${value}_page_${pageNumber + v.incr}`, `${pageAction}_${pageNumber + v.incr}`));
        const skipToPageButton = new slack_block_models_1.ButtonElement(new slack_block_models_1.SlackText('Skip to page'), value, skipPageAction);
        const paginationAction = new slack_block_models_1.ActionBlock(blockId);
        if (pageNumber <= 1) {
            paginationAction.addElements([nextPageButton, skipToPageButton]);
            return [header, paginationAction];
        }
        if (pageNumber >= noOfPages) {
            paginationAction.addElements([prevPageButton, skipToPageButton]);
            return [header, paginationAction];
        }
        paginationAction.addElements([prevPageButton, nextPageButton, skipToPageButton]);
        return [header, paginationAction];
    }
}
exports.default = PaginationHelpers;
//# sourceMappingURL=pagination-helpers.js.map