require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());            // allow calls from Netlify
app.use(express.json());    // parse JSON bodies

// Nodemailer transport using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,          // or 587 if you prefer
  secure: true,       // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS  // your app password
  }
});

// Simple POST /send endpoint
app.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await transporter.sendMail({
      from: `"${name || 'Contact Form'}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name || 'Website'}`,
      text: message || '',
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ ok: false, error: 'Email failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Email API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
