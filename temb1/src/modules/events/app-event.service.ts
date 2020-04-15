import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface IEventPayload<T = { [key: string]: any }> {
  botToken?: string;
  data: T;
}

export class AppEvents {
  private readonly subject: Subject<unknown>;

  constructor() {
    this.subject = new Subject();
  }

  subscribe(name: string, subscriber: Function) {
    this.subject.pipe(filter((e: any) => e.name === name))
      .subscribe((e) => subscriber(e.data));
  }

  broadcast<T = { [key: string]: any }>({ name, data }: { name: string; data: IEventPayload<T>; }) {
    this.subject.next({ name, data });
  }
}

const appEvents = new AppEvents();
export default appEvents;
