import ILogger from '../logger.interface';

class Logger implements ILogger {
  log(error: string | Error): void | Promise<void> { console.log(error); }

  warn(error: string | Error): void | Promise<void> { }

  info(error: string | Error): void | Promise<void> { }

  error(error: string | Error): void | Promise<void> { }
}

export const mockLogger = new Logger();
