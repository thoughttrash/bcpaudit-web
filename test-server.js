const http = require('http');

// Test health endpoint
const healthOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
};

const healthReq = http.request(healthOptions, (res) => {
  console.log('Health Check Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Health Response:', JSON.parse(data));
  });
});

healthReq.on('error', (e) => {
  console.error('Health check failed:', e.message);
});

healthReq.end();

// Test login endpoint
const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const loginData = JSON.stringify({
  username: 'admin',
  password: 'admin123'
});

const loginReq = http.request(loginOptions, (res) => {
  console.log('Login Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Login Response:', JSON.parse(data));
  });
});

loginReq.on('error', (e) => {
  console.error('Login test failed:', e.message);
});

loginReq.write(loginData);
loginReq.end();
