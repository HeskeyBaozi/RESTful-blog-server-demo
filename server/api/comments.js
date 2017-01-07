'use strict';

import Router from 'koa-router';
import Comment from '../models/comment';
import {isBearerAuthenticated} from '../auth';

const router = new Router();

router.use(isBearerAuthenticated());

router.get('/comments/:comment_id',
    async ctx => {
        ctx.body = await Comment.findById(ctx.params.comment_id);
    });

export default router.routes();