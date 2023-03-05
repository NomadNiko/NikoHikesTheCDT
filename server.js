const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'iexplor'
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
