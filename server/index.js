'use strict';

import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import routes from './api';
import passport from './auth';


const app = new Koa();
app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(passport.initialize());
app.use(routes);

export default app;