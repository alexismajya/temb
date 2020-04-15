import SlackNotifications from '../slack/SlackPrompts/Notifications';
import appEvents from './app-event.service';
import { feedbackConstants } from './feedback-event.constants';

class FeedbackEventHandlers {
  init() {
    appEvents.subscribe(feedbackConstants.feedbackEvent,
      feedbackEventHandler.sendFeedbackrequest);
  }

  async sendFeedbackrequest() {
    await SlackNotifications.requestFeedbackMessage();
  }
}

export const feedbackEventHandler = new FeedbackEventHandlers();
export default FeedbackEventHandlers;
