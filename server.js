const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser')
const { signinHandler, welcomeHandler, refreshHandler } = require('./handlers')

app.use(bodyParser.json())
app.use(cookieParser())

class Session {
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

		// we'll use this method later to determine if the session has expired
    isExpired() {
        this.expiresAt < (new Date())
    }
}

// this object stores the users sessions. For larger scale applications, you can use a database or cache for this purpose
const sessions = {}

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

  });
      // User is authenticated, redirect to dashboard or homepage
	  const sessionToken = uuid.v4()
	   // set the expiry time as 120s after the current time
    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)

    // create a session containing information about the user and expiry time
    const session = new Session(username, expiresAt)
    // add the session information to the sessions map
    sessions[sessionToken] = session

    // In the response, set a cookie on the client with the name "session_cookie"
    // and the value as the UUID we generated. We also set the expiry time
    res.cookie("session_token", sessionToken, { expires: expiresAt })
    res.end()
	  
    app.get('/welcome', welcomeHandler)
});

const welcomeHandler = (req, res) => {
    // if this request doesn't have any cookies, that means it isn't
    // authenticated. Return an error code.
    if (!req.cookies) {
        res.status(401).end()
        return
    }

    // We can obtain the session token from the requests cookies, which come with every request
    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        // If the cookie is not set, return an unauthorized status
        res.status(401).end()
        return
    }

    // We then get the session of the user from our session map
    // that we set in the signinHandler
    userSession = sessions[sessionToken]
    if (!userSession) {
        // If the session token is not present in session map, return an unauthorized error
        res.status(401).end()
        return
    }
    // if the session has expired, return an unauthorized error, and delete the 
    // session from our map
    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        res.status(401).end()
        return
    }

    // If all checks have passed, we can consider the user authenticated and
    // send a welcome message
    res.send(`Welcome  ${userSession.username}!`).end()
}	

const refreshHandler = (req, res) => {
    // (BEGIN) The code from this point is the same as the first part of the welcomeHandler
    if (!req.cookies) {
        res.status(401).end()
        return
    }

    const sessionToken = req.cookies['session_token']
    if (!sessionToken) {
        res.status(401).end()
        return
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        res.status(401).end()
        return
    }
    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        res.status(401).end()
        return
    }
    // (END) The code until this point is the same as the first part of the welcomeHandler

    // create a new session token
    const newSessionToken = uuid.v4()

    // renew the expiry time
    const now = new Date()
    const expiresAt = new Date(+now + 120 * 1000)
    const session = new Session(userSession.username, expiresAt)

    // add the new session to our map, and delete the old session
    sessions[newSessionToken] = session
    delete sessions[sessionToken]

    // set the session token to the new value we generated, with a
    // renewed expiration time
    res.cookie("session_token", newSessionToken, { expires: expiresAt })
    res.end()
}

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
