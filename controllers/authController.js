// controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');



// Login function with JWT
exports.login = (req, res) => {
    const { username, password } = req.body;

    console.log(`Login attempt: Username: ${username}`);

    const query = 'SELECT * FROM logged_in_users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ success: false, message: 'Error querying the database' });
        }

        if (results.length === 0) {
            console.log('No user found with the provided username');
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // Compare passwords
        bcrypt.compare(password, results[0].password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            }

            if (result) {
                // Generate JWT Token
                const token = jwt.sign(
                    { id: results[0].id, username: results[0].username },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                console.log(`Login successful for user: ${username}`);
                return res.json({ success: true, token, username: results[0].username });
            } else {
                console.log('Password did not match for user:', username);
                return res.status(401).json({ success: false, message: 'Invalid username or password.' });
            }
        });
    });
};

// Logout function
exports.logout = (req, res) => {
    res.sendStatus(200); // Client just needs to remove the token
};

// Sign-up function
exports.signup = (req, res) => {
    const { username, email, password, church_id, branch_name } = req.body;
    
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        
        const query = 'INSERT INTO logged_in_users (username, email, password, church_id, branch_name) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [username, email, hash, church_id, branch_name], (err) => {
            if (err) {
                console.error('Error inserting new user:', err);
                return res.status(500).send('Server error');
            }
            res.redirect('/Login.html');
        });
    });
};
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }

    next();
};
