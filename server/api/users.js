'use strict';

import Router from 'koa-router';
import User from '../models/user';
import {getHash} from '../utils';
import {abilityType} from '../constant';
import {createPagination} from './helper';
import {isBearerAuthenticated} from '../auth';

const router = new Router();

router.get('/users',
    isBearerAuthenticated(),
    createPagination(User, {}, {limit: 10}),
    async ctx => {
        ctx.body = ctx.pagination;
    });

router.post('/user', async ctx => {
    const body = ctx.request.body;
    try {
        ctx.body = await User.create({
            username: body.username,
            hashed_password: getHash(body.password),
            email: body.email,
            ability: abilityType.normal
        });
        ctx.status = 201;
    } catch (error) {
        throw error;
    }
});

router.get('/user',
    isBearerAuthenticated(),
    async ctx => {
        ctx.body = ctx.passport.user;
    });

export default router.routes();