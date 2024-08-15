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



async function fetchPodcasts() {
    try {
        const response = await fetch('/api/podcasts');
        if (!response.ok) throw new Error('Network response was not ok');
        const podcasts = await response.json();

        const episodeGrid = document.getElementById('episodeGrid');
        episodeGrid.innerHTML = ''; // Clear existing content

        podcasts.forEach(podcast => {
            const episode = document.createElement('div');
            episode.classList.add('episode');
            episode.dataset.id = podcast.id; // Add dataset ID to identify the episode
            episode.innerHTML = `
                <h3>${podcast.title}</h3>
                <p>${podcast.description}</p>
                ${podcast.url.includes('youtube') ? `<iframe width="560" height="315" src="${podcast.url.replace('watch?v=', 'embed/')}" allowfullscreen></iframe>` : ''}
                ${podcast.url.endsWith('.mp4') ? `<video width="320" height="240" controls>
                    <source src="${podcast.url}" type="video/mp4">
                    Your browser does not support the video element.
                </video>` : ''}
                <a href="${podcast.url}" target="_blank">Watch/Listen</a>
                <div>Likes: <span class="like-count">${podcast.like_count || 0}</span></div>
                <button class="like-button" onclick="likePodcast('${podcast.id}')">Like</button>
                <button class="delete-button" onclick="deletePodcast('${podcast.id}')">Delete</button>
            `;
            episodeGrid.appendChild(episode);
        });
    } catch (error) {
        console.error('Error fetching podcasts:', error);
    }
}

async function deletePodcast(id) {
    try {
        const response = await fetch(`/api/podcasts/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.success) {
            // Remove the podcast from the display
            const episodeElement = document.querySelector(`.episode[data-id="${id}"]`);
            if (episodeElement) {
                episodeElement.remove();
            }
            alert('Podcast deleted successfully');
        } else {
            alert('Failed to delete podcast');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete podcast');
    }
}

async function likePodcast(id) {
    try {
        const response = await fetch(`/api/podcasts/${id}/like`, {
            method: 'POST',
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.success) {
            // Update the like count on the page
            const likeCountElement = document.querySelector(`.episode[data-id="${id}"] .like-count`);
            if (likeCountElement) {
                likeCountElement.textContent = result.new_like_count;
            }
            alert('Podcast liked successfully');
        } else {
            alert('Failed to like podcast');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to like podcast');
    }
}

// Call the fetch function when the page loads
window.onload = fetchPodcasts;

// Handle form submissions
document.getElementById('uploadPodcast').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/podcasts/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            fetchPodcasts(); // Refresh the podcast list
            e.target.reset(); // Reset the form
        } else {
            alert('Failed to upload podcast');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to upload podcast');
    }
};

document.getElementById('addPodcastLink').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/podcasts/link', {
            method: 'POST',
            body: new URLSearchParams(formData) // Ensure it sends the correct body format
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            fetchPodcasts(); // Refresh the podcast list
            e.target.reset(); // Reset the form
        } else {
            alert('Failed to add podcast link');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add podcast link');
    }
};

