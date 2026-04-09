require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// --- REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
});

const Room = require('./models/Room');

// --- AUTHENTICATION MIDDLEWARE ---
// This acts as a bouncer. It checks for a valid token before letting users into the room routes.
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); // Token is valid, proceed to the route
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// --- CREATE ROOM ROUTE ---
app.post('/api/rooms', authenticate, async (req, res) => {
  try {
    // Generate a random 6-character alphanumeric code (e.g., "X7B9TQ")
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await Room.create({ 
      roomId, 
      hostId: req.userId 
    });

    res.status(201).json({ roomId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// --- GET/VALIDATE ROOM ROUTE ---
// ... (Keep all your existing imports, db connection, and API routes up to the GET /api/rooms/:id route) ...

app.get('/api/rooms/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ message: "Room found", room });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// ==========================================
// Phase 3: SOCKET.IO INTEGRATION
// ==========================================
const http = require('http');
const { Server } = require('socket.io');

// Wrap the Express app in a standard Node HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS allowing your Next.js frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Listen for incoming WebSocket connections
// 🔥 NEW: Store active users per room
// Store active users and active timers
const roomUsers = {}; 
const socketRoomMap = {}; 
const roomTimers = {}; 
const roomTodos = {}; // 🔥 NEW: Track the to-do list for each room

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, userName }) => {
    socket.join(roomId);
    socketRoomMap[socket.id] = roomId;

    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    roomUsers[roomId].push({ socketId: socket.id, name: userName });

    io.to(roomId).emit('update-participants', roomUsers[roomId]);
    
    if (roomTimers[roomId]) {
      socket.emit('timer-sync', roomTimers[roomId]);
    }

    // 🔥 NEW: Send the current to-do list to the newly joined user
    if (!roomTodos[roomId]) roomTodos[roomId] = [];
    socket.emit('todo-sync', roomTodos[roomId]);
  });

  // --- Timer Actions ---
  socket.on('timer-action', ({ roomId, action, durationMinutes }) => {
    if (action === 'start') {
      const endTime = Date.now() + durationMinutes * 60 * 1000;
      roomTimers[roomId] = endTime;
      io.to(roomId).emit('timer-sync', endTime);
    } else if (action === 'stop') {
      delete roomTimers[roomId];
      io.to(roomId).emit('timer-sync', null);
    }
  });

  // 🔥 NEW: To-Do List Actions
  socket.on('todo-action', ({ roomId, action, payload }) => {
    if (!roomTodos[roomId]) roomTodos[roomId] = [];

    if (action === 'add') {
      // payload is the text of the new task
      const newTodo = { id: Date.now().toString(), text: payload, completed: false };
      roomTodos[roomId].push(newTodo);
    } else if (action === 'toggle') {
      // payload is the ID of the task
      const todo = roomTodos[roomId].find(t => t.id === payload);
      if (todo) todo.completed = !todo.completed;
    } else if (action === 'delete') {
      // payload is the ID of the task
      roomTodos[roomId] = roomTodos[roomId].filter(t => t.id !== payload);
    }

    // Broadcast the updated list to everyone in the room
    io.to(roomId).emit('todo-sync', roomTodos[roomId]);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    const roomId = socketRoomMap[socket.id];
    
    if (roomId && roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter(user => user.socketId !== socket.id);
      io.to(roomId).emit('update-participants', roomUsers[roomId]);
      
      if (roomUsers[roomId].length === 0) {
        delete roomUsers[roomId];
        delete roomTimers[roomId];
        delete roomTodos[roomId]; // 🔥 Clean up memory when the room empties
      }
    }
    delete socketRoomMap[socket.id];
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));