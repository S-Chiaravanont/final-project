require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const pg = require('pg');
const ClientError = require('./client-error');

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
    throw new ClientError(401, 'invalid login');
  }
});

app.use(staticMiddleware);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
