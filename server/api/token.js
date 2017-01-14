'use strict';

import Router from 'koa-router';
import server from '../auth/oauth2';
import AccessToken from '../models/access-token';
import { isBearerAuthenticated } from '../auth';

const router = new Router();

router.post('/token',
    async (ctx, next) => {
        ctx.state.user = ctx.passport.user;
        await next();
    },
    server.token(),
    server.errorHandler());

router.get('/token',
    isBearerAuthenticated(),
    async (ctx, next) => {
        ctx.body = ctx.passport.user;
    });

export default router.routes();