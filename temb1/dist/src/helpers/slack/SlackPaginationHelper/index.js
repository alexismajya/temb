"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../../modules/slack/SlackModels/SlackMessageModels");
const pageSize = Number(process.env.SLACK_PAGE_SIZE) || 10;
class SlackPagination {
    static createPaginationAttachment(callBackId, value, pageNumber, noOfPages) {
        const paginationAttachment = new SlackMessageModels_1.SlackAttachment('', `Page ${pageNumber} of ${noOfPages}`);
        const prevPageButton = new SlackMessageModels_1.SlackButtonAction(`page_${pageNumber - 1}`, '< Prev', value, '#FFCCAA');
        const nextPageButton = new SlackMessageModels_1.SlackButtonAction(`page_${pageNumber + 1}`, 'Next >', value, '#FFCCAA');
        const skipToPageButton = new SlackMessageModels_1.SlackButtonAction('skipPage', 'Skip to page', value, '#FFCCAA');
        paginationAttachment.addOptionalProps(callBackId, undefined, '#4285f4');
        if (pageNumber <= 1) {
            paginationAttachment.addFieldsOrActions('actions', [nextPageButton]);
            paginationAttachment.addFieldsOrActions('actions', [skipToPageButton]);
            return paginationAttachment;
        }
        if (pageNumber >= noOfPages) {
            paginationAttachment.addFieldsOrActions('actions', [prevPageButton]);
            paginationAttachment.addFieldsOrActions('actions', [skipToPageButton]);
            return paginationAttachment;
        }
        paginationAttachment.addFieldsOrActions('actions', [prevPageButton, nextPageButton, skipToPageButton]);
        return paginationAttachment;
    }
    static getSlackPageSize() {
        return pageSize;
    }
    static getPageNumber(buttonName) {
        return buttonName.includes('page') ? Number(buttonName.split('_')[1]) : 1;
    }
}
exports.default = SlackPagination;
//# sourceMappingURL=index.js.map