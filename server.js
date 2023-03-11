const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');

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
  const inputs = ['businessname', 'password', 'address', 'description'];
  
  const values = inputs.map(input => req.body[input]); // map inputs to their corresponding values in req.body
  const hashedPassword = hashPassword(values[1]); // hash the password for security

  // Insert new row into business table with provided information
  const sql = `INSERT INTO business (business_name, business_password, business_address, business_description)
               VALUES (?, ?, ?, ?)`;
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating new account:', err);
      return res.status(500).send('Error creating new account');
    }
    res.redirect('/login.html'); // redirect to login page after successful account creation
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
