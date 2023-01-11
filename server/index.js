require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const pg = require('pg');
const ClientError = require('./client-error');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('./authorization-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

app.use(express.json());

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
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
            throw new ClientError(401, 'invalid login');
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
  const preference = 'null';
  if (!username || !password || !fullName) {
    throw new ClientError(401, 'invalid login 1 here');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("userName", "hashedPassword", "fullName", "gender", "yearOfBirth", "preference")
            values ($1, $2, $3, $4, $5, $6)
            returning "fullName", "createdAt";
      `;
      const params = [username, hashedPassword, fullName, gender, yearOfBirth, preference];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

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
           "location",
           "eventId"
      from "events"
      join "users" using ("userId")
      join "eventLocations" using ("eventId")
      join "locations" using ("locationId")
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

app.post('/api/createEvent/:userId', (req, res, next) => {
  const id = Number(req.body.host);
  if (id < 1) {
    throw new ClientError(400, 'id is not valid, must be greater than 0');
  }
  const { sport, date, time, eventName, note, participant, location, lat, lng } = req.body;
  const sql = `
    with step_one as (
      insert into "events"("userId", "eventName", "sport", "date", "time", "note", "participant")
      values ($1, $2, $3, $4, $5, $6, $7)
      returning "eventId"
    ),
    step_two as (
      insert into "locations"("location", "lat", "lng")
      values ($8, $9, $10)
      returning "locationId"
    )
    insert into "eventLocations"("eventId", "locationId")
      select "eventId", "locationId" from step_one, step_two
      returning "eventId"
  `;
  const params = [id, eventName, sport, date, time, note, participant, location, lat, lng];
  db.query(sql, params)
    .then(result => {
      const eventId = result.rows;
      res.json({ eventId });
    })
    .catch(err => next(err));

});

app.get('/api/event/:eventId', (req, res, next) => {
  const eventId = Number(req.params.eventId);
  if (eventId < 1) {
    throw new ClientError(400, 'eventId is not valid, must be greater than 0');
  }
  const sql = `
    select "sport",
           "note",
           "participant",
           "date",
           "time",
           "eventName",
           "location",
           "userId",
           "lat",
           "lng",
           "fullName"
      from "events"
      join "users" using ("userId")
      join "eventLocations" using ("eventId")
      join "locations" using ("locationId")
      where "eventId" = $1
  `;
  const params = [eventId];
  db.query(sql, params)
    .then(result => {
      const events = result.rows;
      res.status(200).json(events);
    })
    .catch(err => next(err));
});

app.post('/api/search/', (req, res, next) => {
  const { sport, latLngLimit } = req.body;
  const { upperLimit, lowerLimit, leftLimit, rightLimit } = latLngLimit;
  const sql = `
    select "sport",
           "note",
           "participant",
           "date",
           "time",
           "eventName",
           "location",
           "userId",
           "lat",
           "lng",
           "fullName"
      from "events"
      join "users" using ("userId")
      join "eventLocations" using ("eventId")
      join "locations" using ("locationId")
      where "sport" = $1
  `;
  const params = [sport, upperLimit, lowerLimit, leftLimit, rightLimit];
  db.query(sql, params)
    .then(result => {
      const events = result.rows;
      res.status(200).json(events);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
