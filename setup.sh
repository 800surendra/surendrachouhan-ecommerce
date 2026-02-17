#!/bin/bash

# Setup script for e-commerce project

# Ensure the script is run from the root directory of the project

# Create directories for backend and frontend
mkdir -p backend
mkdir -p frontend

# Setup backend
cd backend
npm init -y
npm install express mongoose dotenv cors

echo "Creating initial server setup..."
cat <<EOL > server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch(err => console.error(err));
EOL

cd ..

# Setup frontend
cd frontend
npx create-react-app .

# Create initial .env file
cd ..
echo "Creating .env file..."
echo "MONGODB_URI=<your-mongodb-uri>" > .env

echo "Setup complete! Navigate to 'backend' and 'frontend' directories to continue development."