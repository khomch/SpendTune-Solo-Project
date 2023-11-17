import * as dotenv from 'dotenv';
import express from 'express';
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

app.use(router);

app.listen(SERVER_PORT, () => {
  console.log(`💰SpendTune💰  server is listening on port ${SERVER_PORT}!`);
});

