'use strict';

import Router from 'koa-router';
import User from '../models/user';
import { getHash } from '../utils';
import { abilityType } from '../constant';
import { createPagination } from './helper';
import { isBearerAuthenticated } from '../auth';

const router = new Router();

router.get('/users',
    isBearerAuthenticated(),
    createPagination(User, {}, { limit: 10 }),
    async ctx => {
        ctx.body = ctx.pagination;
    });

router.get('/user/:user_id',
    isBearerAuthenticated(),
    async ctx => {
        ctx.body = await User.findById(ctx.params.user_id);
    });

router.post('/user', async ctx => {
    const body = ctx.request.body;
    ctx.body = await User.create({
        username: body.username,
        hashed_password: getHash(body.password),
        email: body.email,
        ability: abilityType.normal
    });
});

router.get('/user',
    isBearerAuthenticated(),
    async ctx => {
        ctx.body = ctx.passport.user;
    });

export default router.routes();