const express = require('express');
const path = require('path');
const app = express();
const config = require('./server-config');

// Middleware setup
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());

// Routes setup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

const routes = ['inbox', 'sent', 'spam', 'trash', 'settings', 'drafts', 'starred'];
routes.forEach(route => {
    app.get(`/${route}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'src', `${route}.html`));
    });
});

// Start server with dynamic port
const server = app.listen(config.port, config.localIP, () => {
    console.log('\n[32m==================================[0m');
    console.log(`[32mServer running on:[0m`);
    console.log(`[36mLocal Network: http://${config.localIP}:${config.port}[0m`);
    if (config.publicIP !== 'ERROR') {
        console.log(`[36mPublic: http://${config.publicIP}:${config.port}[0m`);
    }
    console.log('[32m==================================[0m\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down server...');
    server.close(() => {
        console.log('\x1b[32m%s\x1b[0m', '✅ Server stopped gracefully');
        process.exit(0);
    });
});