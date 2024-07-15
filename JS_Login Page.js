const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',      // Change if your MySQL server is hosted elsewhere
    user: 'root',           // Your MySQL username
    password: '',           // Your MySQL password
    database: 'your_database_name'  // Your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.send('Username already exists');
                } else {
                    res.send('An error occurred, please try again');
                }
            } else {
                res.send('Signup successful');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
