const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');

// setActive

app.use(session({
  secret: 'iD10tPr00f1nG',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


// Set up MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'iexplor'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL as ID', connection.threadId);
});

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle POST request to create a new business account
app.post('/signup', (req, res) => {
  const { businessname, password, address, description } = req.body;
  const hashedPassword = hashPassword(password); // hash the password for security

  // Insert new row into business table with provided information
  const sql = `INSERT INTO business (business_name, business_password, business_address, business_description)
               VALUES (?, ?, ?, ?)`;
  const values = [businessname, hashedPassword, address, description];
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating new account:', err);
      return res.status(500).send('Error creating new account');
    }
    res.redirect('/login.html'); // redirect to login page after successful account creation
  });
});

// Handle POST request to log in to an existing business account
app.post('/login', (req, res) => {
  const { businessname, password } = req.body;
  const hashedPassword = hashPassword(password); // hash the password for security

  // Check if there is a business in the database with the given name and password
  const sql = `SELECT * FROM business WHERE business_name = ? AND business_password = ?`;
  const values = [businessname, hashedPassword];
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error checking login credentials:', err);
      return res.status(500).send('User doesnt exist, check Business Name');
    }
    if (results.length === 0) {
      return res.status(401).send('Invalid login credentials');
    }
    // User is authenticated, redirect to dashboard or homepage
	  req.session.userId = user.id;
    res.redirect('/test_auth.html');
  });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Helper function to hash a password for storage in the database
function hashPassword(password) {
  // Implementation of password hashing would go here, for example using bcrypt or SHA-256
  // This is just a placeholder for demonstration purposes
  return password;
}
