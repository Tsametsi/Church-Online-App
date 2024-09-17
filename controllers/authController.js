// controllers/authController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');


// Login function with detailed logging
exports.login = (req, res) => {
    const { username, password } = req.body;
    
    // Log the incoming request details
    console.log(`Login attempt: Username: ${username}`);

    const query = 'SELECT * FROM logged_in_users WHERE username = ?';

    // Execute the database query
    db.query(query, [username], (err, results) => {
        if (err) {
            // Log the error if the database query fails
            console.error('Error querying the database:', err);
            return res.status(500).json({ success: false, message: 'Error querying the database' });
        }

        // Log the query result
        console.log('Query result:', results);

        if (results.length === 0) {
            console.log('No user found with the provided username');
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        // Compare the provided password with the stored hash
        bcrypt.compare(password, results[0].password, (err, result) => {
            if (err) {
                // Log the error if password comparison fails
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            }

            // Log the password comparison result
            console.log('Password comparison result:', result);

            if (result) {
                const updateQuery = 'UPDATE logged_in_users SET logged_in = 1 WHERE username = ?';
                db.query(updateQuery, [username], (err) => {
                    if (err) {
                        // Log the error if updating the login status fails
                        console.error('Error updating user login status:', err);
                        return res.status(500).json({ success: false, message: 'Error updating user login status' });
                    }

                    // Log the successful login
                    console.log(`Login successful for user: ${username}`);
                    return res.json({ success: true, username: results[0].username });
                });
            } else {
                // Log the failed password match
                console.log('Password did not match for user:', username);
                return res.status(401).json({ success: false, message: 'Invalid username or password.' });
            }
        });
    });
};

// Logout function
exports.logout = (req, res) => {
    const { username } = req.body;
    const query = 'UPDATE logged_in_users SET logged_in = 0 WHERE username = ?';
    
    db.query(query, [username], (err) => {
        if (err) {
            console.error('Error updating user logout status:', err);
            return res.status(500).send('Server error');
        }
        res.sendStatus(200);
    });
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
