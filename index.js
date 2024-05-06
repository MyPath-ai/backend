// Suppress specific deprecation message (from openAI)
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && chunk.includes('DeprecationWarning: The `punycode` module is deprecated')) {
    return false;
  }
  return originalStderrWrite(chunk, encoding, callback);
};

require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const db = require('./db/func/pool');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// SwaggerUI Docs
// Please Add $DOCS_URL and $DOCS_PORT for HTTP or $DOCS_HTTPS_URL for HTTPS to build ENV
const fallbackURL = 'http://localhost:8080';
let envURL = null;
if (process.env.DOCS_URL && process.env.DOCS_PORT) {
  envURL = `http://${process.env.DOCS_URL}:${process.env.DOCS_PORT}`;
} else if (process.env.DOCS_HTTPS_URL) {
  envURL = `${process.env.DOCS_HTTPS_URL}`;
}
// const envURL = process.env.DOCS_URL && process.env.DOCS_PORT ? `http://${process.env.DOCS_URL}:${process.env.DOCS_PORT}` : `${process.env.DOCS_HTTPS_URL}`;
const swOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'MyPath-Ai API Documentation',
    },
    servers: [
      {
        url: envURL || fallbackURL,
      },
    ],
  },
  apis: [
    './routes/*.js',
  ],
};

const swSpecs = swaggerJsdoc(swOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swSpecs),
);

// DB Check
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

// Define Routes
app.use('/auth/v1', require('./routes/auth'));
app.use('/vision/v1', require('./routes/vision'));
app.use('/goal/v1', require('./routes/goal'));
app.use('/task/v1', require('./routes/task'));
app.use('/ai/v1', require('./routes/ai'));

// Start the server
const port = process.env.API_PORT || 8080;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
