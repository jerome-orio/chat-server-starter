import { createServer } from 'http'
import { Server } from 'socket.io'
import express from 'express'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('send-message', (msg) => {
    io.emit('receive-message', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.get('/', (req, res) => {
  res.send('WebSocket server is running')
})

export interface Env {
  MY_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.headers.get('Upgrade') === 'websocket') {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      server.accept();

      server.addEventListener('message', (event) => {
        // Broadcast the received message back to all connected clients
        server.send(`Echo: ${event.data}`);
      });

      server.addEventListener('close', () => {
        console.log('WebSocket connection closed');
      });

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return new Response('WebSocket server is running', { status: 200 })
  },
}