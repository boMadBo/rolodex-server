import { config } from '@/config';
import authRouter from '@/modules/auth/auth.router';
import userRouter from '@/modules/user/user.router';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const { port } = config.api;
const { dbUrl } = config.mongo;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('DB connected');
  })
  .catch(e => console.log(e));

app.use(express.json());
app.use(cors());

app.use('/api', [authRouter, userRouter]);

const server = app.listen(port, () => {
  console.log(`App works on ${port}`);
});

server.on('error', (err: Error) => {
  console.error(err);
});
