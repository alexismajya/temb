export default interface ILogger {
  log(error: string | Error): void | Promise<void>;
  warn(error: string | Error): void | Promise<void>;
  info(error: string | Error): void | Promise<void>;
  error(error: string | Error): void | Promise<void>;
}
