import request from 'request-promise-native';
import { Modal } from '../models/slack-block-models';

export interface IViewOpenOptions {
  botToken: string;
  modal: Modal;
  triggerId: string;
}

export class SlackViews {
  private readonly send: ({ url, body }: { url: string; body: any}) => Promise<any>;
  private readonly endpoints: { open: string; push: string; update: string; };

  constructor(botToken: string, baseUrl = 'https://slack.com/api') {
    this.endpoints = {
      open: `${baseUrl}/views.open`,
      push: `${baseUrl}/views.push`,
      update: `${baseUrl}/views.update`,
    };

    this.send =  ({ url, body }: { url: string; body: any}) => request.post({
      url,
      body,
      headers: {
        Authorization: `Bearer ${botToken}`,
      },
      json: true,
    });
  }

  public open(triggerId: string, payload: Modal) {
    const body = {
      trigger_id: triggerId,
      view: payload,
    };
    const submit = this.send({
      body,
      url: this.endpoints.open,
    });
    return submit;
  }

  public update(viewId: string, payload: Modal) {
    const body = {
      view_id: viewId,
      view: payload,
    };
    const submit = this.send({
      body,
      url: this.endpoints.update,
    });
    return submit;
  }

  static getSlackViews = (botToken: string) => new SlackViews(botToken);

  static open = (options: IViewOpenOptions) => SlackViews.getSlackViews(options.botToken)
    .open(options.triggerId, options.modal)
}
const getSlackViews = (botToken: string) => new SlackViews(botToken);

export default getSlackViews;
