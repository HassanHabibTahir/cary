const express = require('express');
const path = require('path');
const cloudClient = require('cloud-config-client');
//const winston = require('winston'); // Assuming you're using Winston for logging

const app = express();

// Function to load configuration from cloud config server
function loadConfiguration() {
  const configParams = {
    application: process.env.APP || 'quik-auction-web',
    endpoint: process.env.CONFIGSERVER_URL || 'http://configserver.c-dev4.svc.rnq.k8s.copart.com/quik-auction-web.yml',
    profiles: process.env.PROFILES ? process.env.PROFILES.split(',') : ['c-dev4'],
    auth: {
      user: process.env.CONFIGSERVER_USER || 'user',
      pass: process.env.CONFIGSERVER_PASSWORD || 'copart',
    },
  };

  return cloudClient.load(configParams).then((config) => {
    // Apply the configurations as needed
    const properties = config.properties;
    process.env = {...process.env, ...properties};
//    winston.info('Configuration loaded from cloud config server');
    console.log(JSON.stringify(properties));
    console.log('Configuration loaded from cloud config server');
  }).catch((err) => {
    console.log('Error loading config from cloud config server:', err);
//    winston.error('Error loading config from cloud config server:', err);
  });
}

// Function to initialize and start the Express server
function initializeServer() {
  const PORT = process.env.PORT || 3000;

  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Load configuration then start the server
loadConfiguration().then(initializeServer);