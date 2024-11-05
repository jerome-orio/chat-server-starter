import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  isTyping: boolean;
}

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  type: 'message' | 'system';
}

const MAX_MESSAGES = 100;
let messageStore: Message[] = [];
let connectedUsers: User[] = [];

const generateMessageId = (): string => uuidv4();

// Helper function to create system messages
const createSystemMessage = (text: string): Message => ({
  id: generateMessageId(),
  username: 'System',
  text,
  timestamp: Date.now(),
  type: 'system',
});

// Helper function to broadcast online users
const broadcastOnlineUsers = (io: any) => {
  broadcastMessage(io, 'online-users', connectedUsers);
};

// Handle user connection and disconnection
const handleUserConnection = (socket: any, io: any, username: string) => {
  const currentUser = { id: socket.id, username, isTyping: false };
  connectedUsers.push(currentUser);

  const systemMessage = createSystemMessage(`${username} joined the chat`);
  messageStore.push(systemMessage);
  if (messageStore.length > MAX_MESSAGES) messageStore.shift();
  broadcastMessage(io, 'receive-message', systemMessage);

  broadcastOnlineUsers(io);
};

const handleUserDisconnection = (socket: any, io: any) => {
  const user = connectedUsers.find((u) => u.id === socket.id);
  if (user) {
    const systemMessage = createSystemMessage(`${user.username} left the chat`);
    messageStore.push(systemMessage);
    if (messageStore.length > MAX_MESSAGES) messageStore.shift();
    broadcastMessage(io, 'receive-message', systemMessage);

    connectedUsers = connectedUsers.filter((u) => u.id !== socket.id);
    broadcastOnlineUsers(io);
  }
};

// Handle incoming messages
const handleMessage = (msg: Message, io: any) => {
  const message: Message = {
    id: msg.id || generateMessageId(),
    username: msg.username,
    text: msg.text,
    timestamp: Date.now(),
    type: 'message',
  };

  messageStore.push(message);
  if (messageStore.length > MAX_MESSAGES) messageStore.shift();
  broadcastMessage(io, 'receive-message', message);
};

// Handle typing start/stop
const handleTypingStart = (username: string, io: any) => {
  const user = connectedUsers.find((u) => u.username === username);
  if (user) {
    user.isTyping = true;
    broadcastMessage(io, 'typing-start', { username });
  }
};

const handleTypingStop = (username: string, io: any) => {
  const user = connectedUsers.find((u) => u.username === username);
  if (user) {
    user.isTyping = false;
    broadcastMessage(io, 'typing-stop', { username });
  }
};

// Universal message broadcast function
const broadcastMessage = (server: any, eventType: string, data: any) => {
  // If it's a Socket.IO environment (i.e., 'io' exists), use io.emit
  if (server.emit) {
    server.emit(eventType, data);  // Socket.IO
  }
  // If it's a WebSocket environment (i.e., 'server.send' exists), use server.send
  else if (server.send) {
    server.send(JSON.stringify({ type: eventType, data }));  // WebSocket
  }
};

export {
  handleUserConnection,
  handleUserDisconnection,
  handleMessage,
  handleTypingStart,
  handleTypingStop,
  broadcastOnlineUsers
};
