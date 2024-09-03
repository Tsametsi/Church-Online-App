const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
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
app.use(express.static('public')); // Serve static files from 'public' directory

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
app.post('/api/podcasts/upload', upload.single('audio'), (req, res) => {
    const { title, description } = req.body;
    const audioFile = req.file ? `/uploads/podcasts/${req.file.filename}` : null;

    const query = 'INSERT INTO podcasts (title, description, audio_file) VALUES (?, ?, ?)';
    db.query(query, [title, description, audioFile], (err) => {
        if (err) {
            console.error('Error inserting podcast:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Podcast uploaded successfully!' });
    });
});

// API endpoint to handle adding podcast link
app.post('/api/podcasts/link', (req, res) => {
    const { title, description, youtube_link } = req.body;

    const query = 'INSERT INTO podcasts (title, description, youtube_link) VALUES (?, ?, ?)';
    db.query(query, [title, description, youtube_link], (err) => {
        if (err) {
            console.error('Error inserting podcast link:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Podcast link added successfully!' });
    });
});

// API endpoint to like a podcast
app.post('/api/podcasts/:id/like', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE podcasts SET like_count = like_count + 1 WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error liking podcast:', err);
            return res.status(500).send('Internal server error');
        }
        res.json({ success: true, message: 'Podcast liked successfully!' });
    });
});

// API endpoint to delete a podcast
app.delete('/api/podcasts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM podcasts WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting podcast:', err);
            return res.status(500).send('Internal server error');
        }
        res.json({ success: true, message: 'Podcast deleted successfully!' });
    });
});

// API endpoint to get all groups
app.get('/api/groups', (req, res) => {
    const sql = `
        SELECT groups.id AS group_id, groups.group_name, GROUP_CONCAT(podcasts.title) AS episodes
        FROM groups
        LEFT JOIN group_podcasts ON groups.id = group_podcasts.group_id
        LEFT JOIN podcasts ON group_podcasts.podcast_id = podcasts.id
        GROUP BY groups.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying groups:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to create a group
app.post('/api/groups', (req, res) => {
    const { groupName, episodes } = req.body;

    if (!groupName || typeof groupName !== 'string' || groupName.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid group name' });
    }

    const selectedEpisodes = JSON.parse(episodes);

    // Insert the new group
    const query = 'INSERT INTO groups (group_name) VALUES (?)';
    db.query(query, [groupName], function (err, result) {
        if (err) {
            console.error('Error inserting group:', err);
            return res.status(500).send('Internal server error');
        }

        const groupId = result.insertId;

        // Insert the group-podcast relations
        const values = selectedEpisodes.map(episodeId => [groupId, episodeId]);
        const groupPodcastQuery = 'INSERT INTO group_podcasts (group_id, podcast_id) VALUES ?';

        db.query(groupPodcastQuery, [values], (err) => {
            if (err) {
                console.error('Error inserting group-podcast relations:', err);
                return res.status(500).send('Internal server error');
            }
            res.json({ success: true, message: 'Group created successfully!' });
        });
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
