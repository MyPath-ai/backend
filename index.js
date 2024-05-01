require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
})

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

// Middleware to handle database connection
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Define Routes

// Start the server
const port = process.env.API_PORT || 8080;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
