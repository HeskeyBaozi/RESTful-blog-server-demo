'use strict';

import Router from 'koa-router';
import User from '../models/user';
import {getHash} from '../utils';
import {abilityType} from '../constant';
import {createPagination} from './helper';

const router = new Router();

router
    .get('/users',
        createPagination(User, {}, {limit: 10}),
        async ctx => {
            ctx.body = ctx.pagination;
        })
    .post('/users', async ctx => {
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

export default router.routes();