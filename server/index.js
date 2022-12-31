require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const pg = require('pg');
const ClientError = require('./client-error');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(express.json());

app.get('/api/user/:userId', (req, res, next) => {
  const id = Number(req.params.userId);
  if (id < 1) {
    throw new ClientError(400, 'id is not valid, must be greater than 0');
  }
  const sql = `
    select "sport",
           "date",
           "time",
           "eventName",
           "fullName"
      from "events"
      join "users" using ("userId")
      where "userId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      const events = result.rows;
      res.status(200).json(events);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login 1');
  }
  const sql = `
    select "userId",
           "hashedPassword",
           "fullName"
      from "users"
    where  "userName" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login 2');
      }
      const { userId, hashedPassword, fullName } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login 3');
          }
          const payload = { userId, fullName };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password, fullName, gender } = req.body;
  const yearOfBirth = req.body.DOB;
  if (!username || !password || !fullName) {
    throw new ClientError(401, 'invalid login 1 here');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "user" ("username", "hashedPassword", "fullName", "gender", "yearOfBirth")
            values ($1, $2, $3, $4, $5)
            returning "username", "fullName"
      `;
      const params = [username, hashedPassword, fullName, gender, yearOfBirth];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
