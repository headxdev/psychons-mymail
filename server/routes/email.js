const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config/config');
const auth = require('../middleware/auth');

// Create SMTP transporter
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
});

// Send email
router.post('/send', auth, async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        const mailOptions = {
            from: config.email.fromAddress,
            to,
            subject,
            text,
            html
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: 'Email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending email');
    }
});

// Get emails (mock implementation - in a real app, this would connect to an email server)
router.get('/inbox', auth, (req, res) => {
    // Mock inbox data
    const mockEmails = [
        {
            id: 1,
            from: 'sender@example.com',
            subject: 'Welcome to MyMail',
            text: 'Thank you for using MyMail!',
            date: new Date().toISOString(),
            read: false
        }
    ];
    
    res.json(mockEmails);
});

// Mark email as read
router.put('/:emailId/read', auth, (req, res) => {
    // Mock implementation
    res.json({ msg: 'Email marked as read' });
});

// Move email to trash
router.put('/:emailId/trash', auth, (req, res) => {
    // Mock implementation
    res.json({ msg: 'Email moved to trash' });
});

// Star/unstar email
router.put('/:emailId/star', auth, (req, res) => {
    // Mock implementation
    res.json({ msg: 'Email star status updated' });
});

module.exports = router;
