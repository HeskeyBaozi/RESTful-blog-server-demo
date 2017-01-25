'use strict';

import Router from 'koa-router';
import Post from '../models/post';
import Comment from '../models/comment';
import { createPagination } from './helper';
import { isBearerAuthenticated } from '../auth';

const router = new Router();

router.use(isBearerAuthenticated());

/**
 * Fetch the list of all posts.
 */
router.get('/posts',
    async (ctx, next) => {
        const keyword = ctx.query.keyword;
        const user_id = ctx.query.user_id;
        const conditions = {};
        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            conditions.title = { $regex: reg };
        }

        if (user_id) {
            conditions.author = user_id;
        }
        ctx.state.conditions = conditions;
        await next();
    },
    createPagination(Post, {
        projection: { content: false }
    } , { limit: 10 }),
    async (ctx, next) => {
        ctx.body = ctx.pagination;
    });

/**
 * Fetch the main fields of a post.
 */
router.get('/posts/:post_id',
    async ctx => {
        ctx.body = await Post.findById(ctx.params.post_id).select({ content: false }).populate({
            path: 'author',
            select: 'username'
        });
    });

/**
 * Fetch the content of a post.
 */
router.get('/posts/:post_id/content',
    async ctx => {
        const currentPost = await Post.findById(ctx.params.post_id).select({ content: true });
        ctx.body = {
            content: currentPost.content
        };
    });

/**
 * Create a new post.
 */
router.post('/posts',
    async ctx => {
        const body = ctx.request.body;
        ctx.body = await Post.create({
            title: body.title,
            content: body.content,
            author: ctx.passport.user._id,
            descendants: [],
            created_at: Date.now()
        });
        ctx.status = 201;
    }
);

/**
 * Update a existed post.
 */
router.patch('/posts/:post_id',
    async ctx => {
        const body = ctx.request.body;
        Object.keys(body).forEach(key => {
            if (!body[key] && key !== 'visible') {
                delete body[key];
            }
        });

        const conditions = ctx.passport.user.ability === 'super' ? { _id: ctx.params.post_id } : {
            _id: ctx.params.post_id,
            author: ctx.passport.user._id
        };
        ctx.body = await Post.findOneAndUpdate(conditions, { $set: body }, {
            new: true,
            fields: { content: false }
        }).populate({ path: 'author', select: 'username' });
    }
);

/**
 * Delete a post.
 */
router.delete('/posts/:post_id',
    async ctx => {
        const toDelete = await Post.findOneAndRemove({
            _id: ctx.params.post_id,
            author: ctx.passport.user._id
        });
        await Comment.find({ _id: { $in: toDelete.descendants } }).remove();
        ctx.body = {};
    });


export default router.routes();