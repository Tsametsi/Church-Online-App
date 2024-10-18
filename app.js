const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs'); // Add this line
const app = express();
const port = 3000;
const cron = require('node-cron');
const saltRounds = 10;
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken'); // Add this at the top


// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server);



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/auth', authRoutes);


// Serve static files (CSS, images, etc.)
app.use(express.static(__dirname));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Serve pages
app.get('/Login.html', (req, res) => res.sendFile(path.join(__dirname, 'Login.html')));
app.get('/Signup.html', (req, res) => res.sendFile(path.join(__dirname, 'Signup.html')));
app.get('/Home.html', (req, res) => res.sendFile(path.join(__dirname, 'Home.html')));
app.get('/Shop.html', (req, res) => res.sendFile(path.join(__dirname, 'Shop.html')));
app.get('/Events.html', (req, res) => res.sendFile(path.join(__dirname, 'Events.html')));
app.get('/Donations.html', (req, res) => res.sendFile(path.join(__dirname, 'Donations.html')));
app.get('/Chat.html', (req, res) => res.sendFile(path.join(__dirname, 'Chat.html')));
app.get('/Channel.html', (req, res) => res.sendFile(path.join(__dirname, 'Channel.html')));
app.get('/podcasts.html', (req, res) => {res.sendFile(__dirname + 'podcasts.html');
});
// Redirect root URL to Login.html
app.get('/', (req, res) => res.redirect('/Login.html'));
//Use Helmet
app.use(helmet());

app.post('/api/verifyToken', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the 'Bearer' string
    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).send('Token is valid');
    } catch (err) {
        res.status(401).send('Invalid or expired token');
    }
});

// Sign-up
app.post('/signup', (req, res) => {
    const { username, email, password, church_id, branch_name, role } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        const query = 'INSERT INTO logged_in_users (username, email, password, church_id, branch_name, role) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [username, email, hash, church_id, branch_name, role], (err) => {
            if (err) {
                console.error('Error inserting new user:', err);
                return res.status(500).send('Server error');
            }

            // Generate JWT Token
            const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        });
    });
});
// Token verification route
app.post('/api/verifyToken', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with the secret key
        res.status(200).send('Token is valid');
    } catch (err) {
        res.status(401).send('Invalid or expired token');
    }
});
// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
    
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with the secret key
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (err) {
        return res.status(401).send('Invalid or expired token');
    }
};


// Handle prayer request submission
app.post('/submit-prayer-request', (req, res) => {
    const { name, email, prayer_request } = req.body;
    const pastorEmail = "eyethugwacela457@gmail.com";
    const query = 'INSERT INTO prayer_request (name, email, prayer_request, pastor_email) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, prayer_request, pastorEmail], (err) => {
        if (err) {
            console.error('Error inserting prayer request:', err);
            return res.status(500).send('Internal server error');
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
                return res.status(500).send('Internal server error');
            }
            res.redirect('/Home.html');
        });
    });
});

// Fetch prayer requests
app.get('/api/prayer-requests', (req, res) => {
    db.query('SELECT * FROM prayer_requests ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Submit prayer request
app.post('/api/prayer-requests', (req, res) => {
    const { username, message } = req.body;
    db.query('INSERT INTO prayer_requests (username, message) VALUES (?, ?)', [username, message], (err, result) => {
        if (err) return res.status(500).json(err);
        const newRequest = { id: result.insertId, username, message, created_at: new Date() };
        io.emit('newPrayerRequest', newRequest);
        res.json(newRequest);
    });
});
 
// Handle email notification setup
app.post('/api/events/:id/notify', (req, res) => {
    const eventId = req.params.id;
    const { email } = req.body;

    // Insert email and notification time into database
    const insertQuery = 'INSERT INTO event_notifications (event_id, email, notified) VALUES (?, ?, 0)';
    db.query(insertQuery, [eventId, email], (err) => {
        if (err) {
            console.error('Error inserting notification:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Notification setup successfully. You will be notified at the time of the event.' });
    });
});


// Scheduled task to check for upcoming events and send notifications
cron.schedule('* * * * *', () => { // Check every minute
    const now = new Date();
    const query = `
        SELECT e.id AS event_id, e.title, e.description, e.event_date, e.virtual_url, en.email
        FROM events e
        JOIN event_notifications en ON e.id = en.event_id
        WHERE e.event_date <= ? AND en.notified = 0
    `;
    db.query(query, [now], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return;
        }

        results.forEach(event => {
            const mailOptions = {
                from: 'followme303030@gmail.com',
                to: event.email,
                subject: `Reminder: ${event.title}`,
                text: `Dear user,

This is a reminder that the event titled "${event.title}" is starting soon.

Event Description:
${event.description}

Event Date: ${new Date(event.event_date).toLocaleString()}

Join us virtually at: ${event.virtual_url || 'N/A'}

Thank you,
Church Online App`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err);
                } else {
                    console.log('Email sent: ' + info.response);

                    // Update notification status
                    const updateQuery = 'UPDATE event_notifications SET notified = 1 WHERE event_id = ? AND email = ?';
                    db.query(updateQuery, [event.event_id, event.email], (err) => {
                        if (err) {
                            console.error('Error updating notification status:', err);
                        }
                    });
                }
            });
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
            return res.status(500).send('Internal server error');
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

// Socket.IO integration
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('send_message', (data) => {
        // Handle chat message logic
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
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
            payment_method_types: ['card'],
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

// Handle Socket.IO connections and events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join chat room
    socket.on('join', (username) => {
        socket.username = username;
        console.log(`${username} joined`);
        // Notify all clients about the new user
        io.emit('user_status', { username, status: 'online' });
    });

    // Handle sending messages
    socket.on('send_message', (data) => {
        const { username, recipient, message, attachment } = data;
        // Send the message to the specified recipient
        io.to(recipient).emit('new_message', { username, message, attachment });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        if (socket.username) {
            // Notify all clients about the user going offline
            io.emit('user_status', { username: socket.username, status: 'offline' });
        }
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
app.get('/executives.html', (req, res) => res.sendFile(path.join(__dirname, 'executives.html')));

// Endpoint to get all podcasts
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

// Endpoint to get all inspirational videos
app.get('/api/inspirational-videos', (req, res) => {
    const sql = 'SELECT * FROM inspirational_videos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying inspirational videos:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Endpoint to like a video
app.post('/api/inspirational-videos/:id/like', (req, res) => {
    const videoId = req.params.id;
    const sql = 'UPDATE inspirational_videos SET likes = likes + 1 WHERE id = ?';
    db.query(sql, [videoId], (err, result) => {
        if (err) {
            console.error('Error liking video:', err);
            return res.status(500).send('Internal server error');
        }
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
                subject: 'Password Recovery',
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



// Create a table for messages if it doesn't exist
db.query(`
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) throw err;
});



// API endpoint to fetch all channels
app.get('/api/channels', (req, res) => {
    db.query('SELECT * FROM channels ORDER BY created_at ASC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API endpoint to create a new channel
app.post('/api/channels', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO channels (name) VALUES (?)', [name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id: results.insertId, name });
    });
});

// API endpoint to fetch messages for a specific channel
app.get('/api/channels/:id/channel_messages', (req, res) => {
    const channelId = req.params.id;
    db.query('SELECT * FROM channel_messages WHERE channel_id = ? ORDER BY created_at ASC', [channelId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API endpoint to send a message to a specific channel
app.post('/api/channels/:id/channel_messages', (req, res) => {
    const channelId = req.params.id;
    const { username, message } = req.body;

    // Insert the message into the channel_messages table
    db.query('INSERT INTO channel_messages (channel_id, username, message) VALUES (?, ?, ?)', [channelId, username, message], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Optionally emit the message to the channel via Socket.IO
        io.to(channelId).emit('new_channel_message', {
            id: results.insertId,
            channelId,
            username,
            message
        });

        res.status(201).json({ success: true, id: results.insertId, message });
    });
});

// API endpoint to add users to a channel
app.post('/api/channels/:id/members', (req, res) => {
    const channelId = req.params.id;
    const { userIds } = req.body; // Expecting an array of user IDs

    const queries = userIds.map(userId => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO channel_members (channel_id, user_id) VALUES (?, ?)', [channelId, userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    });

    Promise.all(queries)
        .then(() => res.status(201).json({ success: true }))
        .catch(err => {
            console.error('Error adding users to channel:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// API endpoint to fetch users for multi-select
app.get('/api/users', (req, res) => {
    db.query('SELECT id, username FROM logged_in_users', (err, results) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Socket.IO integration
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('send_channel_message', (data) => {
        // Handle channel message logic
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


// Set up storage for podcasts
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/podcasts/'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage }); // Define the upload variable here


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
app.post('/api/podcasts/upload', upload.fields([{ name: 'audio' }, { name: 'video' }]), (req, res) => {
    const { title, description } = req.body;
    const audioUrl = req.files['audio'] ? `/uploads/podcasts/${req.files['audio'][0].filename}` : null;
    const videoUrl = req.files['video'] ? `/uploads/podcasts/${req.files['video'][0].filename}` : null;

    const query = 'INSERT INTO podcasts (title, description, audio_file, video_file) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, audioUrl, videoUrl], (err) => {
        if (err) {
            console.error('Error inserting podcast:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Podcast uploaded successfully!' });
    });
});


// API endpoint to handle adding podcast link
// Express route for adding a podcast link
app.post('/api/podcasts/link', (req, res) => {
    const { title, description, youtube_link } = req.body;

    // Validate inputs
    if (!title || !description || !youtube_link) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert into the database
    const query = 'INSERT INTO podcasts (title, description, youtube_link) VALUES (?, ?, ?)';
    db.query(query, [title, description, youtube_link], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error adding podcast' });
        }
        res.status(201).json({ message: 'Podcast added successfully' });
    });
});
// Express route for adding a podcast link
app.post('/api/podcasts/:id/like', (req, res) => {
    const podcastId = req.params.id;
    const userId = req.body.user_id; // Assume user ID is sent in the request body

    const checkLikeSql = 'SELECT * FROM likes WHERE user_id = ? AND podcast_id = ?';
    db.query(checkLikeSql, [userId, podcastId], (err, results) => {
        if (err) {
            console.error('Error checking like:', err);
            return res.status(500).send('Internal server error');
        }

        // If the user has not liked the podcast yet, add a new like
        if (results.length === 0) {
            const insertLikeSql = 'INSERT INTO likes (user_id, podcast_id) VALUES (?, ?)';
            db.query(insertLikeSql, [userId, podcastId], (err) => {
                if (err) {
                    console.error('Error inserting like:', err);
                    return res.status(500).send('Internal server error');
                }

                // Increment the like_count in the podcasts table
                const updateLikeCountSql = 'UPDATE podcasts SET like_count = like_count + 1 WHERE id = ?';
                db.query(updateLikeCountSql, [podcastId], (err) => {
                    if (err) {
                        console.error('Error updating like count:', err);
                        return res.status(500).send('Internal server error');
                    }
                    res.json({ success: true, message: 'Liked the podcast!', new_like_count: results.length + 1 });
                });
            });
        } else {
            // User has already liked the podcast
            res.status(400).json({ success: false, message: 'You have already liked this podcast.' });
        }
    });
});
// Podcast dislike
app.post('/api/podcasts/:id/dislike', (req, res) => {
    const podcastId = req.params.id;
    const userId = req.body.user_id; // Assume user ID is sent in the request body

    // Check if the user has already disliked the podcast
    const checkDislikeSql = 'SELECT * FROM podcast_comments WHERE user_id = ? AND podcast_id = ? AND emoji = "dislike"';
    db.query(checkDislikeSql, [userId, podcastId], (err, results) => {
        if (err) {
            console.error('Error checking dislike:', err);
            return res.status(500).send('Internal server error');
        }

        // If the user has not disliked the podcast yet, increment the dislike count
        if (results.length === 0) {
            const updateDislikeCountSql = 'UPDATE podcasts SET dislike_count = dislike_count + 1 WHERE id = ?';
            db.query(updateDislikeCountSql, [podcastId], (err) => {
                if (err) {
                    console.error('Error updating dislike count:', err);
                    return res.status(500).send('Internal server error');
                }

                // Optionally, add a record to podcast_comments to track the dislike
                const insertCommentSql = 'INSERT INTO podcast_comments (podcast_id, user_id, comment_text, emoji, created_at) VALUES (?, ?, ?, "dislike", NOW())';
                db.query(insertCommentSql, [podcastId, userId, 'User disliked this podcast.'], (err) => {
                    if (err) {
                        console.error('Error inserting dislike record:', err);
                        return res.status(500).send('Internal server error');
                    }
                    res.json({ success: true, message: 'Disliked the podcast!', new_dislike_count: results.length + 1 });
                });
            });
        } else {
            // User has already disliked the podcast
            res.status(400).json({ success: false, message: 'You have already disliked this podcast.' });
        }
    });
});

//Unlike podcast
app.delete('/api/podcasts/:id/unlike', (req, res) => {
    const podcastId = req.params.id;
    const userId = req.body.user_id; // Assume user ID is sent in the request body

    const deleteLikeSql = 'DELETE FROM likes WHERE user_id = ? AND podcast_id = ?';
    db.query(deleteLikeSql, [userId, podcastId], (err, results) => {
        if (err) {
            console.error('Error unliking podcast:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Check if any rows were affected (meaning the like was found and deleted)
        if (results.affectedRows > 0) {
            // Decrement the like_count in the podcasts table
            const updateLikeCountSql = 'UPDATE podcasts SET like_count = like_count - 1 WHERE id = ?';
            db.query(updateLikeCountSql, [podcastId], (err) => {
                if (err) {
                    console.error('Error updating like count:', err);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                res.json({ success: true, message: 'Unliked the podcast!', new_like_count: results.affectedRows });
            });
        } else {
            res.status(400).json({ success: false, message: 'You have not liked this podcast.' });
        }
    });
});


// API endpoint to handle group creation

// API endpoint to fetch all groups
app.get('/api/groups', (req, res) => {
    const sql = `
        SELECT g.id AS group_id, g.group_name, 
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'id', p.id,
                       'title', p.title
                   )
               ) AS episodes
        FROM podcast_groups g
        LEFT JOIN podcast_group_podcasts gp ON g.id = gp.group_id
        LEFT JOIN podcasts p ON p.id = gp.podcast_id
        GROUP BY g.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying groups:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to create a new group
app.post('/api/groups', (req, res) => {
    const { groupName, episodes } = req.body;

    // Insert new group
    const queryGroup = 'INSERT INTO podcast_groups (group_name) VALUES (?)';
    db.query(queryGroup, [groupName], (err, results) => {
        if (err) {
            console.error('Error inserting group:', err);
            return res.status(500).send('Internal server error');
        }

        const groupId = results.insertId;
        if (episodes && episodes.length > 0) {
            // Insert group-podcast relationships
            const queryGroupPodcasts = 'INSERT INTO podcast_group_podcasts (group_id, podcast_id) VALUES ?';
            const values = episodes.map(episodeId => [groupId, episodeId]);

            db.query(queryGroupPodcasts, [values], (err) => {
                if (err) {
                    console.error('Error inserting group-podcast relationships:', err);
                    return res.status(500).send('Internal server error');
                }
                res.status(201).json({ success: true, message: 'Group created successfully!' });
            });
        } else {
            res.status(201).json({ success: true, message: 'Group created successfully!' });
        }
    });
});

// Ensure uploads/podcasts directory exists
const podcastsDir = path.join(__dirname, 'uploads/podcasts');
if (!fs.existsSync(podcastsDir)) {
    fs.mkdirSync(podcastsDir, { recursive: true }); // Create directory if it doesn't exist
}


// Like a scripture
app.post('/scriptures/:id/like', (req, res) => {
    const scriptureId = req.params.id;
    const userId = req.body.user_id; // Pass user ID from client

    db.query('INSERT INTO likes (scripture_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)', 
             [scriptureId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 1) {
            return res.json({ message: 'Liked successfully' });
        } else {
            return res.status(400).json({ message: 'You have already liked this scripture' });
        }
    });
});

// Post a comment on a scripture
app.post('/scriptures/:id/comments', (req, res) => {
    const scriptureId = req.params.id;
    const { user_id, comment_text } = req.body;

    db.query('INSERT INTO comments (scripture_id, user_id, comment_text) VALUES (?, ?, ?)', 
             [scriptureId, user_id, comment_text], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, scripture_id: scriptureId, user_id, comment_text });
    });
});

// Get comments for a scripture
app.get('/scriptures/:id/comments', (req, res) => {
    const scriptureId = req.params.id;

    db.query('SELECT * FROM comments WHERE scripture_id = ?', [scriptureId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

let podcasts = [
    // Example podcasts
    { id: '1', title: 'Episode 1', description: 'Description of Episode 1', youtube_link: 'https://youtube.com/watch?v=xyz', video_url: 'https://example.com/video.mp4', like_count: 10 }
];

// Get all podcasts
app.get('/api/podcasts', (req, res) => {
    res.json(podcasts);
});


// Fetch a single podcast by ID
app.get('/api/podcasts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM podcasts WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching podcast:', err);
            return res.status(500).send('Internal server error');
        }
        if (results.length === 0) {
            return res.status(404).send('Podcast not found');
        }
        res.json(results[0]);
    });
});

// Function to add a like
// Route to like a podcast
app.post('/api/podcasts/:id/like', (req, res) => {
    const podcastId = req.params.id;

    // Update like count in the database
    db.query('UPDATE podcasts SET like_count = like_count + 1 WHERE id = ?', [podcastId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error updating like count' });
        }

        // Retrieve new like count
        db.query('SELECT like_count FROM podcasts WHERE id = ?', [podcastId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error retrieving like count' });
            }

            if (results.length > 0) {
                res.json({ success: true, new_like_count: results[0].like_count });
            } else {
                res.status(404).json({ success: false, message: 'Podcast not found' });
            }
        });
    });
});


// Function to remove a like
async function removeLike(podcastId, userId) {
    const sql = 'DELETE FROM likes WHERE podcast_id = ? AND user_id = ?';
    connection.query(sql, [podcastId, userId], (err, results) => {
        if (err) {
            console.error('Error removing like:', err);
            return;
        }
        console.log('Like removed successfully');
    });
}

// Function to increment like count
async function incrementLikeCount(podcastId) {
    const sql = 'UPDATE podcasts SET like_count = like_count + 1 WHERE id = ?';
    connection.query(sql, [podcastId], (err, results) => {
        if (err) {
            console.error('Error incrementing like count:', err);
            return;
        }
        console.log('Like count incremented successfully');
    });
}

// Function to decrement like count
async function decrementLikeCount(podcastId) {
    const sql = 'UPDATE podcasts SET like_count = like_count - 1 WHERE id = ?';
    connection.query(sql, [podcastId], (err, results) => {
        if (err) {
            console.error('Error decrementing like count:', err);
            return;
        }
        console.log('Like count decremented successfully');
    });
}

// API endpoint to delete a podcast
app.delete('/api/podcasts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM podcasts WHERE id = ?';

    // Use 'db' instead of 'connection'
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting podcast:', err);
            return res.status(500).send('Internal server error');
        }
        res.json({ success: true });
    });
});

// API endpoint to get podcast comments
app.get('/api/podcasts/:id/comments', (req, res) => {
    const podcastId = req.params.id;
    db.query(
        `SELECT pc.*, u.username FROM podcast_comments pc
         JOIN logged_in_users u ON pc.user_id = u.id
         WHERE pc.podcast_id = ?`,
        [podcastId],
        (error, results) => {
            if (error) {
                console.error('Error querying comments:', error);
                return res.status(500).send('Error fetching comments');
            }
            res.json(results);
        }
    );
});



// Endpoint to get topics
app.get('/api/topics', (req, res) => {
    db.query('SELECT * FROM topics', (err, results) => {
        if (err) {
            console.error('Error fetching topics:', err);
            res.status(500).json({ error: 'Failed to fetch topics' });
            return;
        }
        res.json(results);
    });
});

// Endpoint to get verses based on topicId
app.get('/api/verses', (req, res) => {
    const topicId = parseInt(req.query.topicId, 10);
    if (isNaN(topicId)) {
        return res.status(400).json({ error: 'Invalid topicId' });
    }
    db.query('SELECT * FROM verses WHERE topic_id = ?', [topicId], (err, results) => {
        if (err) {
            console.error('Error fetching verses:', err);
            res.status(500).json({ error: 'Failed to fetch verses' });
            return;
        }
        res.json(results);
    });
});

// Example endpoint for posting scriptures
app.post('/api/postScripture', (req, res) => {
    const { scriptureText, username } = req.body;
    db.query('INSERT INTO scriptures (text, username) VALUES (?, ?)', [scriptureText, username], (err, results) => {
        if (err) {
            console.error('Error posting scripture:', err);
            res.status(500).json({ error: 'Failed to post scripture' });
            return;
        }
        res.json({ success: true, id: results.insertId });
    });
});



// Get all discussions
app.get('/api/discussions', (req, res) => {
    db.query('SELECT * FROM discussions ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Create new discussion
// Create new discussion

// Create new discussion with audio upload
app.post('/api/discussions', upload.single('audio'), (req, res) => {
    const { title, content, username } = req.body;

    // Save audio file path if uploaded
    const audioPath = req.file ? req.file.path : null;

    const query = 'INSERT INTO discussions (title, content, username, created_at, audio_path) VALUES (?, ?, ?, NOW(), ?)';
    db.query(query, [title, content, username, audioPath], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Discussion created', discussionId: results.insertId });
    });
});

// Create a new comment
app.post('/api/discussions/:id/comments', (req, res) => {
    const discussionId = req.params.id;
    const { content, username } = req.body; // Include username in the request body

    if (!content || !username) {
        return res.status(400).json({ message: 'Content and username are required' });
    }

    db.query('INSERT INTO discussion_comments (discussion_id, content, username) VALUES (?, ?, ?)', [discussionId, content, username], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, content, username }); // Send username back in response
    });
});



// Get comments for a discussion
app.get('/api/discussions/:id/comments', (req, res) => {
    const discussionId = req.params.id;
    db.query('SELECT * FROM discussion_comments WHERE discussion_id = ?', [discussionId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});



// Like a comment
app.post('/api/comments/:id/like', (req, res) => {
    const commentId = req.params.id;
    const userId = req.body.userId; // This should come from the user's session or token

    db.query('INSERT INTO discussion_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Liked successfully' });
    });
});
// Get replies for a comment
app.get('/api/comments/:id/replies', (req, res) => {
    const commentId = req.params.id;
    db.query('SELECT * FROM discussion_comment_replies WHERE comment_id = ?', [commentId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Create a new reply
app.post('/api/comments/:id/replies', (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    db.query('INSERT INTO discussion_comment_replies (comment_id, content) VALUES (?, ?)', [commentId, content], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, content });
    });
});
// Create new discussion with audio upload
app.post('/api/discussions', upload.single('audio'), (req, res) => {
    const { title, content, username } = req.body;

    // Save audio file path if uploaded
    const audioPath = req.file ? req.file.path : null; // multer automatically populates req.file

    const query = 'INSERT INTO discussions (title, content, username, created_at, audio_path) VALUES (?, ?, ?, NOW(), ?)';
    db.query(query, [title, content, username, audioPath], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Discussion created', discussionId: results.insertId });
    });
});


// Endpoint to add a topic
app.post('/api/topics', (req, res) => {
    const { topic_name } = req.body;
    const sql = 'INSERT INTO Scripture_topics (topic_name) VALUES (?)';
    db.query(sql, [topic_name], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, topic_name });
    });
});

// Endpoint to get all topics
app.get('/api/topics', (req, res) => {
    const sql = 'SELECT * FROM Scripture_topics ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Route to fetch organizations by category
app.get('/api/organizations/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const query = `
        SELECT o.id, o.name, o.email, o.phone, o.description, o.address
        FROM donations_organizations o
        WHERE o.help_category_id = ?;
    `;

    db.query(query, [categoryId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching organizations');
        }
        res.json(results);
    });
});

// Route to sign up organizations
app.post('/api/signup', (req, res) => {
    const { name, email, phone, contactPerson, orgNumber, description, helpCategoryId, address } = req.body;
    const query = `
        INSERT INTO donations_organizations (name, email, phone, contact_person, org_number, description, help_category_id, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, email, phone, contactPerson, orgNumber, description, helpCategoryId, address], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error signing up organization');
        }
        res.send('Organization signed up successfully');
    });
});

// Register a Donor
app.post('/api/registerDonor', (req, res) => {
    const { name, email, phone, helpCategoryId, address, donorType } = req.body;

    const query = 'INSERT INTO donors (name, email, phone, help_category_id, address, donor_type) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, email, phone, helpCategoryId, address, donorType];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering donor.' });
        }
        res.status(201).json({ message: 'Donor registered successfully.' });
    });
});

// Fetch donors by help category
app.get('/api/donors/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;

    const query = `
        SELECT * FROM donors 
        WHERE help_category_id = ?`;

    db.query(query, [categoryId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching donors.' });
        }
        res.json(results);
    });
});

// Route to display donors and donees
app.get('/donors-donees', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'donors-donees.html'));
});
app.post('/submit_volunteer', (req, res) => {
    const { volunteerName, volunteerEmail, volunteerPhone, volunteerSkills, volunteerAvailability } = req.body;

    // Log the incoming data for debugging
    console.log('Volunteer data:', {
        volunteerName,
        volunteerEmail,
        volunteerPhone,
        volunteerSkills,
        volunteerAvailability
    });

    // Check if any of the required fields are missing
    if (!volunteerName || !volunteerEmail || !volunteerPhone || !volunteerSkills || !volunteerAvailability) {
        return res.status(400).send('All fields are required.');
    }

    // SQL insert statement
    const query = 'INSERT INTO volunteers (name, email, phone, skills, availability) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [volunteerName, volunteerEmail, volunteerPhone, volunteerSkills, volunteerAvailability], (err) => {
        if (err) {
            console.error('Error inserting volunteer:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Volunteer application submitted successfully!');
    });
});
app.post('/submit_review', (req, res) => {
    const { name, rating, review } = req.body;

    // Assuming you have a database function to insert reviews
    db.query('INSERT INTO donation_reviews (username, rating, review) VALUES (?, ?, ?)', 
        [name, rating, review], 
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error inserting review' });
            }
            res.status(201).json({ name, rating, review });
        }
    );
});
app.get('/get_reviews', (req, res) => {
    db.query('SELECT username, rating, review FROM donation_reviews ORDER BY created_at DESC', 
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error fetching reviews' });
            }
            res.json(results);
        }
    );
});


// Route to fetch organizations by category


// API endpoints

// 1. Create a new event
app.post('/api/events/upload', upload.single('image'), (req, res) => {
    const { title, description, event_date, virtual_url, ticket_url } = req.body;
    const image_url = req.file ? req.file.path : null; // Get uploaded image path

    if (!title || !description || !event_date) {
        return res.status(400).json({ success: false, message: 'Title, description, and event date are required.' });
    }

    const query = 'INSERT INTO events (title, description, event_date, virtual_url, ticket_url, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';
    db.query(query, [title, description, event_date, virtual_url || null, ticket_url || null, image_url], (err, results) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true });
    });
});

// 2. Fetch all events
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

// 3. Notify users for a specific event (basic example)
app.post('/api/events/:id/notify', (req, res) => {
    const eventId = req.params.id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Here you would typically save the notification preference to a database or send an email
    console.log(`Notify ${email} for event ID ${eventId}`);
    res.json({ success: true, message: 'Notification set up successfully.' });
});

// 4. Update an event (optional)
app.put('/api/events/:id', upload.single('image'), (req, res) => {
    const eventId = req.params.id;
    const { title, description, event_date, virtual_url, ticket_url } = req.body;
    const image_url = req.file ? req.file.path : null;

    const query = 'UPDATE events SET title = ?, description = ?, event_date = ?, virtual_url = ?, ticket_url = ?, image_url = ? WHERE id = ?';
    db.query(query, [title, description, event_date, virtual_url, ticket_url, image_url, eventId], (err, results) => {
        if (err) {
            console.error('Error updating event:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true });
    });
});

// 5. Delete an event (optional)
app.delete('/api/events/:id', (req, res) => {
    const eventId = req.params.id;

    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [eventId], (err, results) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Event deleted successfully.' });
    });
});
// API endpoint to fetch pastors
app.get('/api/pastors', (req, res) => {
    const query = 'SELECT * FROM logged_in_users WHERE role = "Pastor"';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying pastors:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});
// API endpoint to submit a prayer request
app.post('/api/prayer/submit', (req, res) => {
    const { userId, pastorId, message } = req.body;
    const query = 'INSERT INTO prayer_requests (user_id, pastor_id, message) VALUES (?, ?, ?)';
    db.query(query, [userId, pastorId, message], (err, result) => {
        if (err) {
            console.error('Error inserting prayer request:', err);
            return res.status(500).send('Internal server error');
        }

        // Optionally, you could emit a socket event here if needed
        io.to(pastorId).emit('new_prayer_request', {
            id: result.insertId,
            userId,
            pastorId,
            message
        });

        res.sendStatus(200);
    });
});
// API endpoint to fetch prayer requests for a specific pastor
// API endpoint to fetch prayer requests for a specific pastor
app.get('/api/prayer/requests/:pastorId', (req, res) => {
    const { pastorId } = req.params;
    const query = `
        SELECT 
            pr.id, 
            pr.message, 
            pr.created_at, 
            lu.username 
        FROM 
            prayer_requests pr 
        JOIN 
            logged_in_users lu ON pr.user_id = lu.id 
        WHERE 
            pr.pastor_id = ? 
        ORDER BY 
            pr.created_at DESC
    `;
    db.query(query, [pastorId], (err, results) => {
        if (err) {
            console.error('Error querying prayer requests:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});
// Get replies for a specific prayer request
app.get('/api/prayer/replies/:requestId', (req, res) => {
    const { requestId } = req.params;
    const query = 'SELECT * FROM prayer_responses WHERE request_id = ?';
    db.query(query, [requestId], (err, results) => {
        if (err) {
            console.error('Error querying replies:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to send a response to a prayer request
app.post('/api/prayer/response', (req, res) => {
    const { requestId, message, pastorName } = req.body;
    const query = 'INSERT INTO prayer_responses (request_id, pastor_name, message) VALUES (?, ?, ?)';
    db.query(query, [requestId, pastorName, message], (err, result) => {
        if (err) {
            console.error('Error inserting response:', err);
            return res.status(500).send('Internal server error');
        }
        res.sendStatus(200);
    });
});

// Socket.IO integration for prayer requests
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('send_prayer_request', (data) => {
        // Handle prayer request logic here if necessary
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});