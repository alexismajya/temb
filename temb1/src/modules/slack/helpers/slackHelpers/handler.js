import { SlackInteractiveMessage } from '../../SlackModels/SlackMessageModels';

export const getAction = (payload, btnAction) => {
  const { actions, callback_id: callBackId } = payload;
  let action = callBackId.split('_')[2];
  if (action === btnAction) {
    ([{ name: action }] = actions);
  }
  return action;
};

export const handleActions = (payload, respond, inputHandlers, extraHandlers = null) => {
  const callbackName = getAction(payload, 'actions');
  let routeHandler = inputHandlers[callbackName];
  if (extraHandlers && !routeHandler) routeHandler = extraHandlers[callbackName];
  if (routeHandler) {
    return routeHandler(payload, respond);
  }
  respond(new SlackInteractiveMessage('Thank you for using Tembea. See you again.'));
};
