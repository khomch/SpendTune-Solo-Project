import * as dotenv from 'dotenv';
import express from 'express';
// const session = require("express-session"); EXTRA CREDTIS :D
import cors from 'cors';
import router from './router';

dotenv.config()
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const SECRET = process.env.SECRET || 'this is not very secure';

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};


const app = express();
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

app.listen(SERVER_PORT, () => {
  console.log(`💰SpendTune💰  server is listening on port ${SERVER_PORT}!`);
});

