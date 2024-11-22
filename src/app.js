import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv'
import eventRouter from './event/router.js';

config()

const app = express();
const port = process.env.PORT || 3000;

const expressErrorHandler = (err, _req, res) => {
  console.error(err.stack);
  res.status(err.status).send(err.message);
};

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: 'You have exceeded the 100 requests in 60 seconds limit!',
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req['rawBody'] = buf;
    },
  })
);


app.use(helmet());
app.use(cors({ origin: true }));

app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/event', eventRouter);

app.use('/', (req, res) => {
  console.log('Inside 404 Error Route');
  res.status(404).send('404 Page Not Found!');
});

// Express Error Handler
app.use(expressErrorHandler);


app.listen(port, async () => {
  console.info(`Server is running at ${port}`);
});