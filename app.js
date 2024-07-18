const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const stripe = require('stripe')('your-stripe-secret-key');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gwacela30#',
    database: 'church_app_database'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: 'followme303030@gmail.com', // Your email
        pass: 'uhdt rhzs than ccfy', // Your email password or app password
    },
});

// Serve static files (CSS, images, etc.)
app.use(express.static(__dirname));

// Serve pages
app.get('/Login.html', (req, res) => res.sendFile(__dirname + '/Login.html'));
app.get('/Signup.html', (req, res) => res.sendFile(__dirname + '/Signup.html'));
app.get('/Home.html', (req, res) => res.sendFile(__dirname + '/Home.html'));
app.get('/Shop.html', (req, res) => res.sendFile(__dirname + '/Shop.html'));
app.get('/Events.html', (req, res) => res.sendFile(__dirname + '/Events.html'));
app.get('/Donations.html', (req, res) => res.sendFile(__dirname + '/Donations.html'));

// Handle login POST request
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM logged_in_users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) {
            res.redirect('/Home.html');
        } else {
            res.send('Invalid username or password.');
        }
    });
});

// Handle prayer request submission
app.post('/submit-prayer-request', (req, res) => {
    const { name, email, prayer_request } = req.body;
    // email you send it to
    const pastorEmail = "eyethugwacela457@gmail.com";

    const query = 'INSERT INTO prayer_request (name, email, prayer_request, pastor_email) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, prayer_request, pastorEmail], (err, results) => {
        if (err) {
            console.error('Error inserting prayer request:', err);
            res.status(500).send('Internal server error');
            return;
        }

        // Send email
        const mailOptions = {
            from: email,
            to: pastorEmail,
            subject: `Prayer Request from ${name}`,
            text: prayer_request,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Internal server error');
            }
            res.send('Prayer request submitted successfully!');
        });
    });
});

// API endpoint to fetch products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying products:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(results);
    });
});

// API endpoint to fetch events
app.get('/api/events', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying events:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(results);
    });
});

// API endpoint to update notification status for an event
app.post('/api/events/notification', (req, res) => {
    const { id, notification_on } = req.body;
    const query = 'UPDATE events SET notification_on = ? WHERE id = ?';
    db.query(query, [notification_on, id], (err, results) => {
        if (err) {
            console.error('Error updating notification status:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json({ success: true });
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
                res.status(500).send('Internal server error');
                return;
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send('Internal server error');
    }
});

// Handle checkout POST request
app.post('/checkout', (req, res) => {
    res.send('Checkout completed!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
