import { HttpClient } from '@angular/common/http';

export class BaseHttpService {
  constructor(protected readonly http: HttpClient) {}
}
