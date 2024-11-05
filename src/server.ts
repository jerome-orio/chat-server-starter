import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import {
  handleUserConnection,
  handleUserDisconnection,
  handleMessage,
  handleTypingStart,
  handleTypingStop,
  broadcastOnlineUsers,
} from './Chat';
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Handle user joining (pass username from the client)
  socket.on('user-joined', ({ username }) => {
    handleUserConnection(socket, io, username);
  });

  // Handle messages
  socket.on('send-message', (msg) => {
    handleMessage(msg, io);
  });

  // Handle typing start/stop
  socket.on('typing-start', ({ username }) => {
    handleTypingStart(username, io);
  });

  socket.on('typing-stop', ({ username }) => {
    handleTypingStop(username, io);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    handleUserDisconnection(socket, io);
  });
});

app.get('/', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
