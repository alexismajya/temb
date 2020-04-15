import WebSocketEvents from '../web-socket-event.service';

describe('websocketEvents Service', () => {
  it('should broadcast an event', async (done) => {
    const websocketEvents = new WebSocketEvents();
    const testPayload = { name: 'TEST_EVENT', data: 'test' };
    const sockets = websocketEvents.broadcast(testPayload.name, testPayload.data);
    expect(sockets).toBeTruthy();
    done();
  });
});
