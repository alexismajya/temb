export default abstract class BaseCache {
  constructor() {}

  protected minuteToSeconds (minutes: number) {
    return 1000 * 60 * minutes;
  }

  abstract save<T = any>(key: string, field: string, value: T): Promise<string>;
  abstract fetch<T = any>(key: string): Promise<T>;
  abstract saveObject<T = any>(key: string, value: T): Promise<string>;
  abstract delete(key: string): Promise<number>;
  abstract flush(): Promise<void>;
}
