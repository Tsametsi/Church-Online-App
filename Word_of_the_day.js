document.addEventListener('DOMContentLoaded', function() {
    loadDailyScripture();

    // Open modal to post scripture
    var postLink = document.getElementById('postLink');
    var modal = document.getElementById('postModal');
    var closeBtn = document.getElementsByClassName('close')[0];

    postLink.onclick = function() {
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Handle scripture form submission
    var scriptureForm = document.getElementById('scriptureForm');

    scriptureForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var scriptureText = document.getElementById('scriptureText').value.trim();

        if (scriptureText === '') {
            alert('Please enter a scripture.');
            return;
        }

        // Save scripture (for demo purposes, using localStorage)
        saveScripture(scriptureText);

        // Clear form
        scriptureForm.reset();

        // Close modal
        modal.style.display = 'none';

        // Reload daily scripture
        loadDailyScripture();
    });

    // Function to save scripture (for demo purposes, using localStorage)
    function saveScripture(scriptureText) {
        // Get existing scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Add new scripture to the array
        var newScripture = {
            scripture_text: scriptureText,
            date: new Date().toLocaleDateString()
        };
        scriptures.push(newScripture);

        // Save updated scriptures back to localStorage
        localStorage.setItem('scriptures', JSON.stringify(scriptures));
    }

    // Function to load daily scripture
    function loadDailyScripture() {
        // Get today's date in string format
        var today = new Date().toLocaleDateString();

        // Get scriptures from localStorage or initialize an empty array
        var scriptures = JSON.parse(localStorage.getItem('scriptures')) || [];

        // Find scripture for today, if exists
        var todaysScripture = scriptures.find(function(scripture) {
            return scripture.date === today;
        });

        // Display daily scripture
        var dailyScriptureDiv = document.getElementById('dailyScripture');
        if (todaysScripture) {
            dailyScriptureDiv.innerHTML = "<p>" + todaysScripture.scripture_text + "</p>";
        } else {
            dailyScriptureDiv.innerHTML = "No scripture found for today.";
        }
    }
});
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL connection config
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Gwacela30#',
    database: 'church_app_database'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to get daily scripture
app.get('/api/daily-scripture', (req, res) => {
    const today = new Date().toLocaleDateString();
    const sql = `SELECT scripture_text FROM scriptures WHERE DATE(date) = CURDATE()`;

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching daily scripture');
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('No scripture found for today');
            }
        }
    });
});

// Route to post scripture
app.post('/api/post-scripture', (req, res) => {
    const scriptureText = req.body.scripture_text;
    const sql = `INSERT INTO scriptures (scripture_text, date) VALUES (?, CURDATE())`;
    const values = [scriptureText];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error posting scripture');
        } else {
            res.send('Scripture posted successfully!');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
