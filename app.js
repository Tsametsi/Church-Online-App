const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const stripe = require('stripe')('your-stripe-secret-key');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs'); // Add this line
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
app.get('/Login.html', (req, res) => res.sendFile(path.join(__dirname, 'Login.html')));
app.get('/Signup.html', (req, res) => res.sendFile(path.join(__dirname, 'Signup.html')));
app.get('/Home.html', (req, res) => res.sendFile(path.join(__dirname, 'Home.html')));
app.get('/Shop.html', (req, res) => res.sendFile(path.join(__dirname, 'Shop.html')));
app.get('/Events.html', (req, res) => res.sendFile(path.join(__dirname, 'Events.html')));
app.get('/Donations.html', (req, res) => res.sendFile(path.join(__dirname, 'Donations.html')));
app.get('/Chat.html', (req, res) => res.sendFile(path.join(__dirname, 'Chat.html')));
app.get('/Channel.html', (req, res) => res.sendFile(path.join(__dirname, 'Channel.html')));
app.get('/', (req, res) => {res.sendFile(__dirname + 'podcasts.html');
});
// Redirect root URL to Login.html
app.get('/', (req, res) => res.redirect('/Login.html'));

// Handle login POST request
app.post('/login', (req, res) => {
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

// Handle logout POST request
app.post('/logout', (req, res) => {
    const { username } = req.body;
    const query = 'UPDATE logged_in_users SET logged_in = 0 WHERE username = ?';
    db.query(query, [username], (err) => {
        if (err) {
            console.error('Error updating user logout status:', err);
            return res.status(500).send('Server error');
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
            return res.status(500).send('Server error');
        }
        res.redirect('/Donations.html');
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

// Socket.IO connections and events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join chat room
    socket.on('join', (username) => {
        socket.username = username;
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

// Routes
// Get all messages
app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY created_at ASC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create a new message
app.post('/api/messages', (req, res) => {
    const { text } = req.body;
    db.query('INSERT INTO messages (text) VALUES (?)', [text], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, text });
    });
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

// API endpoint to send a message to a channel
app.post('/api/channels/:id/channel_messages', (req, res) => {
    const channelId = req.params.id;
    const { username, message } = req.body;
    db.query('INSERT INTO channel_messages (channel_id, username, message) VALUES (?, ?, ?)', [channelId, username, message], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, id: results.insertId, message });
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
// API endpoint to handle adding podcast link
app.post('/api/podcasts/link', (req, res) => {
    const { title, description, link } = req.body;

    const query = 'INSERT INTO podcasts (title, description, url, like_count) VALUES (?, ?, ?, 0)';
    db.query(query, [title, description, link], (err) => {
        if (err) {
            console.error('Error inserting podcast link:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Podcast link added successfully!' });
    });
});


// API endpoint to handle group creation
app.post('/api/groups', (req, res) => {
    const { groupName, episodes } = req.body;

    // Basic validation
    if (!groupName || typeof groupName !== 'string' || groupName.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid group name' });
    }

    let episodeIds;
    try {
        episodeIds = JSON.parse(episodes);
        if (!Array.isArray(episodeIds)) {
            return res.status(400).json({ success: false, message: 'Episodes should be an array' });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Episodes must be a valid JSON array' });
    }

    // Insert group into database
    const insertGroupQuery = 'INSERT INTO podcast_groups (name) VALUES (?)';
    db.query(insertGroupQuery, [groupName], (err, result) => {
        if (err) {
            console.error('Error inserting group:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        const groupId = result.insertId;

        // Insert episodes into database
        const insertEpisodesQuery = 'INSERT INTO episode_groups (group_id, episode_id) VALUES ?';
        const values = episodeIds.map(episodeId => [groupId, episodeId]);

        db.query(insertEpisodesQuery, [values], (err) => {
            if (err) {
                console.error('Error inserting episodes:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            res.status(201).json({ success: true, message: 'Group created successfully!' });
        });
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
// Function to add a like and increment the like count
async function addLike(podcastId, userId) {
    const addLikeSql = 'INSERT INTO likes (podcast_id, user_id) VALUES (?, ?)';
    const incrementLikeCountSql = 'UPDATE podcasts SET like_count = like_count + 1 WHERE id = ?';

    // Start a transaction to ensure atomicity
    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return;
        }

        // Insert like into the likes table
        connection.query(addLikeSql, [podcastId, userId], (err, results) => {
            if (err) {
                return connection.rollback(() => {
                    console.error('Error adding like:', err);
                    return;
                });
            }

            // Update like count in the podcasts table
            connection.query(incrementLikeCountSql, [podcastId], (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error('Error incrementing like count:', err);
                        return;
                    });
                }

                // Commit the transaction
                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Error committing transaction:', err);
                            return;
                        });
                    }
                    console.log('Like added and like count incremented successfully');
                });
            });
        });
    });
}


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

// API endpoint to fetch comments for a podcast
app.get('/api/podcasts/:id/comments', (req, res) => {
    const podcastId = req.params.id;
    const sql = 'SELECT * FROM comments WHERE podcast_id = ? ORDER BY comment_date DESC';
    connection.query(sql, [podcastId], (err, results) => {
        if (err) {
            console.error('Error querying comments:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// API endpoint to add a comment to a podcast
app.post('/api/podcasts/:id/comments', (req, res) => {
    const podcastId = req.params.id;
    const { user_name, comment_text } = req.body;

    const sql = 'INSERT INTO comments (podcast_id, user_name, comment_text) VALUES (?, ?, ?)';
    connection.query(sql, [podcastId, user_name, comment_text], (err) => {
        if (err) {
            console.error('Error inserting comment:', err);
            return res.status(500).send('Internal server error');
        }
        res.status(201).json({ success: true, message: 'Comment added successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});