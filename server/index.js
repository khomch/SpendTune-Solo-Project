require('dotenv').config();
const express = require('express');
// const session = require("express-session"); EXTRA CREDTIS :D
const cors = require('cors');
const router = require('./router');
const app = express();

const SERVER_PORT = process.env.SERVER_PORT || 3001;
const SECRET = process.env.SECRET || 'this is not very secure';


const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());
// app.use(                     EXTRA CREDTIS :D => authentication
//   session({
//     name: 'sid',
//     saveUninitialized: false,
//     resave: false,
//     secret: SECRET,
//     cookie: {
//       maxAge: 1000 * 60 * 60, // 1hr
//       sameSite: true,
//       httpOnly: false,
//       secure: false,
//     },
//   })                         EXTRA CREDTIS :D
// );
app.use(router);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(`😞 Sorry, something went wrong! ${err}`);
  } else {
    console.log(`💰SpendTune💰  server is listening on port ${SERVER_PORT}!`);
  }
});

