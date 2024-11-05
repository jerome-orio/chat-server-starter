import {
  handleUserConnection,
  handleUserDisconnection,
  handleMessage,
  handleTypingStart,
  handleTypingStop,
  broadcastOnlineUsers,
} from './Chat';

export interface Env {
  MY_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.headers.get('Upgrade') === 'websocket') {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      server.accept();

      const decoder = new TextDecoder();

      server.addEventListener('message', (event) => {
        let data: any;

        if (event.data instanceof ArrayBuffer) {
          data = JSON.parse(decoder.decode(event.data));
        } else if (typeof event.data === 'string') {
          data = JSON.parse(event.data);
        }

        // Handle incoming messages
        if (data.type === 'user-joined') {
          handleUserConnection(data, server, data.username);
        }

        if (data.type === 'send-message') {
          handleMessage(data, server);
        }

        if (data.type === 'typing-start') {
          handleTypingStart(data.username, server);
        }

        if (data.type === 'typing-stop') {
          handleTypingStop(data.username, server);
        }
      });

      server.addEventListener('close', (event) => {
        handleUserDisconnection(event, server);
      });

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return new Response('WebSocket server is running', { status: 200 });
  },
};
