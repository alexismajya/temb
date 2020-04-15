import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import SlackPagination from '../../../helpers/slack/SlackPaginationHelper';
import DialogPrompts from '../SlackPrompts/DialogPrompts';

export const responseMessage = (
  text = 'You have no trip history'
) => new SlackInteractiveMessage(text);


export const getPageNumber = (payload) => {
  let pageNumber;

  if (payload.submission) {
    ({ pageNumber } = payload.submission);
  }

  if (payload.actions) {
    const tempPageNo = SlackPagination.getPageNumber(payload.actions[0].name);
    pageNumber = tempPageNo || 1;
  }

  return pageNumber;
};

export const triggerPage = (payload, respond) => {
  const { actions: [{ value: requestType }], callback_id: callbackId } = payload;
  if (payload.actions && payload.actions[0].name === 'skipPage') {
    respond(new SlackInteractiveMessage('Noted...'));
    return DialogPrompts.sendSkipPage(payload, requestType, callbackId);
  }
  if (payload.actions && payload.actions[0].name === 'search') {
    return DialogPrompts.sendSearchPage(payload, requestType, callbackId, respond);
  }
};
