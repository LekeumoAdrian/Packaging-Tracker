const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const http = require('http');
const socketIo = require('socket.io');
const deliveryController = require('./controllers/deliveryController');

// Initialize Express
const app = express();

// create server
const server = http.createServer(app);
const io = socketIo(server);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Type, Accept, Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

// Export io to use in other files
app.set('io', io);

// Connect Database
connectDB();

// Initialize Middleware
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/delivery', deliveryRoutes);

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  });


io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('location_changed', (data) => {
      deliveryController.updateLocation(data);
    });

    socket.on('status_changed', (data) => {
      deliveryController.updateStatus(data);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  });


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
