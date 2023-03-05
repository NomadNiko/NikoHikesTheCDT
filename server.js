const https = require('https');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();



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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup', (req, res) => {
  const { businessName, businessPassword, businessAddress, businessDescription } = req.body;
  pool.getConnection()
    .then(conn => {
      conn.query(`INSERT INTO business (name, password, address, description) VALUES (?, ?, ?, ?)`, [businessName, businessPassword, businessAddress, businessDescription])
        .then(result => {
          console.log(`Inserted ${result.affectedRows} row(s)`);
          res.status(200).send('Account created successfully!');
          conn.release();
        })
        .catch(error => {
          console.log(error);
          res.status(500).send('Internal Server Error');
          conn.release();
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/login', (req, res) => {
  const { businessName, businessPassword } = req.body;
  pool.getConnection()
    .then(conn => {
      conn.query(`SELECT * FROM business WHERE name=? AND password=?`, [businessName, businessPassword])
        .then(rows => {
          if (rows.length === 1) {
            console.log('Login successful');
            res.status(200).send('Login successful!');
          } else {
            console.log('Login failed');
            res.status(401).send('Unauthorized');
          }
          conn.release();
        })
        .catch(error => {
          console.log(error);
          res.status(500).send('Internal Server Error');
          conn.release();
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    });
});

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/site.nomadniko.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/site.nomadniko.com/fullchain.pem'),
};

https.createServer(options, app).listen(443, () => {
  console.log('Server listening on port 443');
});
