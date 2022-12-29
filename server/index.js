require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const pg = require('pg');

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
  const sql = `
    select "sport",
           "date",
           "time",
           "eventName"
      from "events"
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

app.use(staticMiddleware);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
