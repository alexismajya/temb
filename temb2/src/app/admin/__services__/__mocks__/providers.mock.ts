import { of, Observable } from 'rxjs';
import providerMock from 'src/app/__mocks__/providers.mock';

export const providerServiceMock = {
  getProviders(): Observable<any[]> {
    return of([providerMock]);
  },

  getViableProviders(): Observable<any> {
    return of({ data: [] });
  }
};
