import express from "express";
import cors from "cors";
import morgan from 'morgan';

import { subscriptionRouter } from './src/routes/subscription.route';
import config from './src/config/config';
import EntityNotFoundError from "./src/exceptions/entityNoyFoundError";
import BadParamError from "./src/exceptions/badParamError";

// App Variables
const PORT = config.PORT || 5000;
const app = express();

// Set state
app.locals.subscriptions = [];

// App Configuration
app.use(cors());
app.use(express.json());

// -- Log http requests
app.use(morgan('combined'));

// -- Default status to catch an error
app.use((req, res, next) => {
  res.status(888);
  next();
})

// -- Routes
app.use('/api', subscriptionRouter);

// -- Invalid URL error
app.all('*', (req, res, next) => {
  if(res.statusCode === 888) res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" }).end();
})

// -- Error handler
app.use((err, req, res, next) => {
  if(err instanceof EntityNotFoundError) {
    res.status(404).json({ status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND" });
  } else if(err instanceof BadParamError || err instanceof SyntaxError) {
    res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
  } else if(err) {
    console.error('--- ERRRORRR PAPAPAA ', err);
    res.status(500).json({ status: 500, errorCode: "INTERNAL_SERVER_ERROR" });
  }
  
  res.end();
})

// -- Server Run
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
