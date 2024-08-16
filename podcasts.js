const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const stripe = require('stripe')('your-stripe-secret-key');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);

// Connect to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gwacela30#',
    database: 'church_app_database'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up storage for podcasts
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/podcasts/'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// API endpoint to fetch all podcasts
app.get('/api/podcasts', (req, res) => {
    const sql = 'SELECT * FROM podcasts';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying podcasts:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Route to handle podcast uploads
app.post('/api/podcasts/upload', upload.single('podcast'), (req, res) => {
    const { title, description } = req.body;
    const podcastUrl = `/uploads/podcasts/${req.file.filename}`;

    const query = 'INSERT INTO podcasts (title, description, url) VALUES (?, ?, ?)';
    db.query(query, [title, description, podcastUrl], (err) => {
        if (err) {
            console.error('Error inserting podcast:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Podcast uploaded successfully!' });
    });
});

// API endpoint to handle adding podcast link
app.post('/api/podcasts/link', (req, res) => {
    const { title, description, link } = req.body;

    const query = 'INSERT INTO podcasts (title, description, url) VALUES (?, ?, ?)';
    db.query(query, [title, description, link], (err) => {
        if (err) {
            console.error('Error inserting podcast link:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Podcast link added successfully!' });
    });
});

