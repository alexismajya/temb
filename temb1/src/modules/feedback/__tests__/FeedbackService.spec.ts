import { Feedback } from '../../../database';
import { feedbackService } from '../feedback.service';

describe('Feedback service', () => {
  const mockFeedbackData = {
    get: () => {
      return { id: 1, feedback: 'my feedback', userId: 1 };
    },
  };
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should create feedback successfully', async () => {
    const spy = jest.spyOn(Feedback, 'create').mockResolvedValue(mockFeedbackData);
    const result = await feedbackService.createFeedback({ userId: 1, feedback: 'the feedback' });
    expect(result).toEqual(mockFeedbackData.get());
    expect(spy).toBeCalled();
  });
});
