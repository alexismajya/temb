import database, { Feedback } from '../../database';
import { BaseService } from '../shared/base.service';
import { IFeedback } from '../../database/models/interfaces/feedback.interface';

class FeedbackService extends BaseService <Feedback, number> {
  constructor(model = database.getRepository(Feedback)) {
    super(model);
  }

  async createFeedback(data: IFeedback) {
    const feedback = await this.model.create(data);
    return feedback.get();
  }
}

export const feedbackService = new FeedbackService();

export default FeedbackService;
