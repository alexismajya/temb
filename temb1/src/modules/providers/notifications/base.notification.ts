import Utils from '../../../utils';
import environment from '../../../config/environment';

export class BaseNotification {
  protected generateToken(payload: any) {
    return Utils.generateToken('3d', payload);
  }

  protected getTripApprovalUrl(payload: any) {
    const token = this.generateToken(payload);
    return `${environment.TEMBEA_FRONTEND_URL}/trips/confirm?token=${token}`;
  }
}
