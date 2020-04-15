import { Request, Response, NextFunction } from 'express';
import { IHomebase } from '../../../database/models/interfaces/homebase.interface';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import { homebaseService } from '../../homebases/homebase.service';
import NewSlackHelpers from './slack-helpers';
import { Modal } from '../models/slack-block-models';

export interface IModalCtx {
  botToken: string;
  homebase: IHomebase;
}

export interface IModalResponse {
  send: (data: any) => void;
  clear: () => void;
  update: (data: any) => void;
  error: (errors: { [ key: string ]: string; }) => void;
}

declare type modalHandlerArgs = (payload: any, submission: any, response: IModalResponse,
  context: IModalCtx) => void;

export default class ModalRouter {
  private readonly routes: Map<string, modalHandlerArgs>;

  constructor() {
    this.routes = new Map<string, modalHandlerArgs>();
  }

  submission(key: string, handler: modalHandlerArgs) {
    this.routes.set(key, handler);
  }

  private isModal(payload: any) {
    return payload.type === 'view_submission';
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    if (body) {
      const payload = JSON.parse(body.payload);
      const respond = {
        send: (data: any) => res.status(200).send(data),
        update: (view: Modal) => res.status(200).send({
          view,
          response_action: 'update',
        }),
        error: (errors: { [key: string]: string }) => res.status(200).send({
          errors,
          response_action: 'errors',
        }),
        clear: () => res.status(200).send({ response_action: 'clear' }),
      };

      if (!this.isModal(payload)) { return next(); }
      const [teamDetails, homebase] = await Promise.all([
        teamDetailsService.getTeamDetails(payload.team.id),
        homebaseService.getHomeBaseBySlackId(payload.user.id),
      ]);
      switch (payload.type) {
        case 'view_submission':
          return this.handleViewSubmission(payload, respond, {
            homebase,
            botToken: teamDetails.botToken,
          });
        default:
          next();
      }
    }
  }

  private async handleViewSubmission(payload: any, response: IModalResponse, context: IModalCtx) {
    const handler = this.routes.get(payload.view.callback_id);
    const submission = NewSlackHelpers.modalParser(payload.view.state.values);
    if (handler) return handler(payload, submission, response, context);
  }
}
