 const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const projectRoutes = require('./routes/projects');
const goalRoutes = require('./routes/goals');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Update CORS configuration
app.use(cors({
  origin: '*', // or whatever port your SvelteKit app is running on
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/', projectRoutes);

app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/goals', goalRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
