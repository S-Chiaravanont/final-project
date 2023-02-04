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
      with step_one as (
        select "eventId"
          from "eventStatus"
          where "userId" = $1 and "responseStatus" = $2
        )
        select "sport",
                "date",
                "time",
                "eventName",
                "location",
                "fullName",
                "eventId"
          from "events"
          join "users" using ("userId")
          join "eventLocations" using ("eventId")
          join "locations" using ("locationId")
          where "eventId" = ANY (select "eventId" from step_one)
  `;
  const params = [id, true];
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
    ),
    step_three as (
      insert into "eventStatus" ("eventId", "userId", "responseStatus")
      values ((select "eventId" from step_one), $1, $11)
    )
    insert into "eventLocations"("eventId", "locationId")
      select "eventId", "locationId" from step_one, step_two
      returning "eventId"
  `;
  const params = [id, eventName, sport, date, time, note, participant, location, parseFloat(lat), parseFloat(lng), true];
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
  let sql;
  let params;
  if (sport === 'All') {
    sql = `
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
           "fullName",
           "eventId"
      from "events"
      join "users" using ("userId")
      join "eventLocations" using ("eventId")
      join "locations" using ("locationId")
      where lat < $1
      and lat > $2
      and lng > $3
      and lng < $4
  `;
    params = [upperLimit, lowerLimit, leftLimit, rightLimit];
  } else {
    sql = `
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
           "fullName",
           "eventId"
      from "events"
      join "users" using ("userId")
      join "eventLocations" using ("eventId")
      join "locations" using ("locationId")
      where "sport" = $1
      and lat < $2
      and lat > $3
      and lng > $4
      and lng < $5
  `;
    params = [sport, upperLimit, lowerLimit, leftLimit, rightLimit];
  }

  db.query(sql, params)
    .then(result => {
      const events = result.rows;
      res.status(200).json(events);
    })
    .catch(err => next(err));
});

app.post('/api/event/edit/:eventId', (req, res, next) => {
  const eventId = Number(req.params.eventId);
  if (eventId < 1) {
    throw new ClientError(400, 'id is not valid, must be greater than 0');
  }
  const { sport, date, time, eventName, note, participant, location, lat, lng } = req.body;
  const sql = `
    with step_one as (
      update "events"
        set "eventName" = $1,
            "sport" = $2,
            "date" = $3,
            "time" = $4,
            "note" = $5,
            "participant" = $6
      where "eventId" = $7
    )
      update "locations"
        set "location" = $8,
            "lat" = $9,
            "lng" = $10
        where "locationId" = $7
  `;
  const params = [eventName, sport, date, time, note, participant, eventId, location, parseFloat(lat), parseFloat(lng)];
  db.query(sql, params)
    .then(result => {
      const resReturn = result.rows;
      res.json({ resReturn });
    })
    .catch(err => next(err));

});

app.delete('/api/event/delete/:eventId', (req, res, next) => {
  const eventId = Number(req.params.eventId);
  if (eventId < 1) {
    throw new ClientError(400, 'id is not valid, must be greater than 0');
  }
  const sql = `
    with step_one as (
      delete from "events" where "eventId" = $1
    ),
    step_two as (
      delete from "locations" where "locationId" = $1
    ),
    step_three as (
    delete from "eventLocations" where "locationId" = $1
    )
    delete from "eventStatus" where "eventId" = $1
  `;
  const params = [eventId];
  db.query(sql, params)
    .then(result => {
      const resReturn = result.rows;
      res.json({ resReturn });
    })
    .catch(err => next(err));
});

app.get('/api/user/account/:userId', (req, res, next) => {
  const id = Number(req.params.userId);
  if (id < 1) {
    throw new ClientError(400, 'id is not valid, must be greater than 0');
  }
  const sql = `
    select "fullName",
           "yearOfBirth",
           "userName",
           "gender",
           "preference"
      from "users"
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

app.put('/api/account/edit/:userId', (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const { userName, preference, fullName, gender } = req.body;
  const yearOfBirth = req.body.DOB;
  if (!userName || !fullName) {
    throw new ClientError(401, 'invalid login 1 here');
  }
  const sqlSelectUserName = `
    select "userId"
     from  "users"
     where "userName" = $1
  `;
  const paramsSearch = [userName];
  db.query(sqlSelectUserName, paramsSearch)
    .then(result => {
      const users = result.rows;
      if (users.length > 0) {
        if (users[0].userId !== userId) {
          res.status(400).json({ error: 'username is invalid' });
          return null;
        }
      }
    })
    .catch(err => next(err));
  const sql = `
      update "users"
        set "userName" = $1,
            "fullName" = $2,
            "gender" = $3,
            "yearOfBirth" = $4,
            "preference" = $5
      where "userId" = $6
      returning "userName", "fullName", "gender", "yearOfBirth", "preference";
  `;
  const params = [userName, fullName, gender, yearOfBirth, preference, userId];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      const payload = { userId, fullName };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.json({ token, user });
    })
    .catch(err => next(err));
});

app.put('/api/password/change/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { oldPass, newPass } = req.body;
  if (!newPass || !oldPass) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "hashedPassword"
      from "users"
    where  "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { hashedPassword } = user;
      return argon2
        .verify(hashedPassword, oldPass)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid password');
          }
        })
        .then(() => {
          argon2
            .hash(newPass)
            .then(hashedPassword => {
              const sqlUpdate = `
        update "users"
          set "hashedPassword" = $1
        where "userId" = $2
      `;
              const paramsUpdate = [hashedPassword, userId];
              return db.query(sqlUpdate, paramsUpdate);
            })
            .then(result => {
              const user = result.rows;
              res.json(user);
            })
            .catch(err => next(err));
        });
    })
    .catch(err => next(err));

});

app.get('/api/eventStatus/:eventId', (req, res, next) => {
  const eventId = Number(req.params.eventId);
  const sql = `
      select "userId",
           "responseStatus"
      from "eventStatus"
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

app.post('/api/event/:eventId/join/:userId', (req, res, next) => {
  const { eventId, userId } = req.params;
  const sql = `
  insert into "eventStatus"("userId", "eventId", "responseStatus")
      values((select "userId" from "users" where "userId" = $1), (select "eventId" from "events" where "eventId" = $2), true)
  returning "responseStatus";
  `;
  const params = [parseInt(userId), parseInt(eventId)];
  db.query(sql, params)
    .then(result => {
      const [responseStatus] = result.rows;
      res.status(200).json(responseStatus);
    })
    .catch(err => next(err));
});

app.put('/api/event/:eventId/join/:userId', (req, res, next) => {
  const { eventId, userId } = req.params;
  const { responseStatus } = req.body;
  const sql = `
  Update "eventStatus"
    set "responseStatus" = $1
    where "userId" = $2 and "eventId" = $3
    returning "responseStatus";
  `;
  const params = [responseStatus, parseInt(userId), parseInt(eventId)];
  db.query(sql, params)
    .then(result => {
      const [responseStatus] = result.rows;
      res.status(200).json(responseStatus);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
