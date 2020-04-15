export class MockError extends Error {
  error: any;
  constructor(public status: number, public message: string) {
    super(message);
    this.error = {
        message
    };
  }
}
