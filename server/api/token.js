'use strict';

import Router from 'koa-router';
import server from '../auth/oauth2';

const router = new Router();

router.post('/token',
    async (ctx, next) => {
        ctx.state.user = ctx.passport.user;
        await next();
    },
    server.token(),
    server.errorHandler());

router.get('/token',
    async (ctx, next) => {
    
    });

export default router.routes();