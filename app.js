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
    password: 'Irene@441',
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

// Serve static files (CSS, images, etc.)
app.use(express.static(__dirname));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service provider
    auth: {
        user: 'followme303030@gmail.com',
        pass: 'fich ohaw cohm fugc'
    }
});

// Serve pages
app.get('/Login.html', (req, res) => res.sendFile(__dirname + '/Login.html'));
app.get('/Signup.html', (req, res) => res.sendFile(__dirname + '/Signup.html'));
app.get('/Home.html', (req, res) => res.sendFile(__dirname + '/Home.html'));
app.get('/Shop.html', (req, res) => res.sendFile(__dirname + '/Shop.html'));
app.get('/Events.html', (req, res) => res.sendFile(__dirname + '/Events.html'));
app.get('/Donations.html', (req, res) => res.sendFile(__dirname + '/Donations.html'));
app.get('/Chat.html', (req, res) => res.sendFile(__dirname + '/Chat.html'));

// Handle login POST request
app.post('/login', (req, res) => {
    console.log('Login request received:', req.body); // Debug log
    const { username, password } = req.body;

    const query = 'SELECT * FROM logged_in_users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (results.length > 0) {
            const updateQuery = 'UPDATE logged_in_users SET logged_in = 1 WHERE username = ?';
            db.query(updateQuery, [username], (err) => {
                if (err) {
                    console.error('Error updating user login status:', err);
                }
                return res.json({ success: true, username: results[0].username });
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
    });
});


// Redirect root URL to Login.html
app.get('/', (req, res) => res.redirect('/Login.html'));

// Handle logout POST request
app.post('/logout', (req, res) => {
    const { username } = req.body;
    const query = 'UPDATE logged_in_users SET logged_in = 0 WHERE username = ?';
    db.query(query, [username], (err) => {
        if (err) {
            console.error('Error updating user logout status:', err);
            res.status(500).send('Server error');
            return;
        }
        res.sendStatus(200);
    });
});

// Handle sign-up POST request
app.post('/signup', (req, res) => {
    const { username, email, password, church_id, branch_name } = req.body;
    const query = 'INSERT INTO logged_in_users (username, email, password, church_id, branch_name) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, password, church_id, branch_name], (err) => {
        if (err) {
            console.error('Error inserting new user:', err);
            res.status(500).send('Server error');
            return;
        }
        res.redirect('/Login.html');
    });
});

// Handle prayer request submission
app.post('/submit-prayer-request', (req, res) => {
    const { name, email, prayer_request } = req.body;
    const pastorEmail = "eyethugwacela457@gmail.com";

    const query = 'INSERT INTO prayer_request (name, email, prayer_request, pastor_email) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, prayer_request, pastorEmail], (err) => {
        if (err) {
            console.error('Error inserting prayer request:', err);
            res.status(500).send('Internal server error');
            return;
        }

        const mailOptions = {
            from: 'followme303030@gmail.com',
            to: pastorEmail,
            subject: 'New Prayer Request',
            text: `Name: ${name}\nEmail: ${email}\nPrayer Request: ${prayer_request}`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Internal server error');
            } else {
                res.redirect('/Home.html');
            }
        });
    });
});

// API endpoint to update event notification status
app.put('/api/events/:id/notification', (req, res) => {
    const { id } = req.params;
    const { notification_on } = req.body;
    const query = 'UPDATE events SET notification_on = ? WHERE id = ?';
    db.query(query, [notification_on, id], (err) => {
        if (err) {
            console.error('Error updating notification status:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json({ success: true });
    });
});

// API endpoint to fetch events
app.get('/api/events', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying events:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to fetch registered users
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM logged_in_users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to fetch chat messages between two users
app.get('/api/chat/messages/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const query = 'SELECT * FROM chat_messages WHERE (username = ? AND recipient = ?) OR (username = ? AND recipient = ?) ORDER BY created_at ASC';
    db.query(query, [user1, user2, user2, user1], (err, results) => {
        if (err) {
            console.error('Error querying chat messages:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to send chat messages
app.post('/api/chat/send', multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
}).single('attachment'), (req, res) => {
    const { username, recipient, message } = req.body;
    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO chat_messages (username, recipient, message, attachment) VALUES (?, ?, ?, ?)';

    db.query(query, [username, recipient, message, attachment], (err, result) => {
        if (err) {
            console.error('Error inserting chat message:', err);
            return res.status(500).send('Internal server error');
        }

        io.to(recipient).emit('new_message', {
            id: result.insertId,
            username,
            recipient,
            message,
            attachment
        });

        res.sendStatus(200);
    });
});

// API endpoint to delete chat messages
app.delete('/api/chat/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM chat_messages WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting chat message:', err);
            return res.status(500).send('Internal server error');
        }
        res.sendStatus(200);
    });
});

// API endpoint to handle donations
app.post('/donate', async (req, res) => {
    const { amount, currency, description } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency,
            description: description,
            payment_method_types: ['alipay'],
        });

        const query = 'INSERT INTO donations (amount, currency, description, status) VALUES (?, ?, ?, ?)';
        db.query(query, [amount, currency, description, 'pending'], (err) => {
            if (err) {
                console.error('Error inserting donation into database:', err);
                return res.status(500).send('Internal server error');
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).send('Internal server error');
    }
});

// Socket.IO connections and events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join chat room
    socket.on('join', (username) => {
        socket.join(username);
        // Broadcast login status
        socket.broadcast.emit('user_status', { username, status: 'online' });
    });

    // Handle sending messages
    socket.on('send_message', (data) => {
        const { username, recipient, message, attachment } = data;
        io.to(recipient).emit('new_message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        // Broadcast logout status
        socket.broadcast.emit('user_status', { username: socket.username, status: 'offline' });
    });
});

// API endpoint to fetch products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying products:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to fetch all church executives
app.get('/api/executives', (req, res) => {
    const query = 'SELECT * FROM executives';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying executives:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Endpoint to get churches
app.get('/api/churches', (req, res) => {
    const sql = 'SELECT id, name FROM churches';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching churches:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Serve the profile page
app.get('/executives.html', (req, res) => res.sendFile(__dirname + '/executives.html'));


// Endpoint to get all podcasts
app.get('/api/podcasts', (req, res) => {
    const sql = 'SELECT * FROM podcasts';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to get all inspirational videos
app.get('/api/inspirational-videos', (req, res) => {
    const sql = 'SELECT * FROM inspirational_videos';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to like a video
app.post('/api/inspirational-videos/:id/like', (req, res) => {
    const videoId = req.params.id;
    const sql = 'UPDATE inspirational_videos SET likes = likes + 1 WHERE id = ?';
    db.query(sql, [videoId], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Video liked!' });
    });
});



// Forgot Password Endpoint
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Fetch the user's password from the database based on the email
    db.query('SELECT password FROM logged_in_users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }

        // Check if the user exists
        if (results.length > 0) {
            const password = results[0].password; // Get the password from the results

            // Prepare email options
            const mailOptions = {
                from: 'followme303030@gmail.com', // Replace with your email
                to: email,
                subject: 'Password Recovery: Keep you password safe',
                text: `Your password is: ${password}` // Password sent in the email
            };

            // Send the email
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ success: false, message: 'Error sending email.' });
                }
                console.log('Password email sent to:', email);
                res.json({ success: true, message: 'Password sent to your email!' });
            });
        } else {
            res.json({ success: false, message: 'No user found with this email.' });
        }
    });
});


// Start the server

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
