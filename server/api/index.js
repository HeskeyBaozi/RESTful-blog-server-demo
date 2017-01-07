'use strict';

import Router from 'koa-router';
import users from './users';
import posts from './posts';
import token from './token';
import comments from './comments';

const router = new Router({
    prefix: '/api/v1'
});


router.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 400;
        ctx.body = {
            code: error.code,
            message: error.message || error.errmsg || error.msg || 'unknown_error',
            error
        };
    }
});

router.use(users);
router.use(token);
router.use(posts);
router.use(comments);

export default router.routes();