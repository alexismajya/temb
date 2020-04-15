import { SlackText, MarkdownText, Block, ButtonElement, ActionBlock,
  } from '../models/slack-block-models';

class PaginationHelpers {

  static getPageNumber(payload: any) {
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

  static addPaginationButtons(routes: any, routeNote: any, pageAction: string,
    userPaginationBlock: string, skipPageAction: string) {
    let paginationBlock;
    if (routes.pageMeta.totalPages > 1) {
      paginationBlock = PaginationHelpers.createPaginationBlock(userPaginationBlock,
            routeNote, routes.pageMeta.page, routes.pageMeta.totalPages, pageAction,
            skipPageAction,
        );
    }
    return paginationBlock;
  }

  // create pagination block
  static createPaginationBlock(blockId: any, value: any, pageNumber: number, noOfPages: number,
    pageAction: string, skipPageAction: string) {
    const paginationHeader = new MarkdownText(`Page ${pageNumber} of ${noOfPages}`);
    const header = new Block().addText(paginationHeader);

    const buttonGenerator = [{ text: '< Prev', incr: -1 }, { text: 'Next >', incr: 1 }];
    const [prevPageButton, nextPageButton] = buttonGenerator.map((v) =>
      new ButtonElement(new SlackText(v.text), `${value}_page_${pageNumber + v.incr}`,
      `${pageAction}_${pageNumber + v.incr}`));

    const skipToPageButton = new ButtonElement(
      new SlackText('Skip to page'), value, skipPageAction);
    const paginationAction = new ActionBlock(blockId);
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

export default PaginationHelpers;
