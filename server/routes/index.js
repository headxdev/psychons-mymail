const express = require('express');
const router = express.Router();

// Define routes here
router.get('/', (req, res) => {
    res.send('Welcome to the Email Website!');
});

// Add more routes as needed

module.exports = router;