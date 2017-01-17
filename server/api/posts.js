'use strict';

import Router from 'koa-router';
import Post from '../models/post';
import {createPagination} from './helper';
import {isBearerAuthenticated} from '../auth';

const router = new Router();

router.use(isBearerAuthenticated());

/**
 * Fetch the list of all posts.
 */
router.get('/posts',
    createPagination(Post, {projection: {content: false}}, {limit: 10}),
    async(ctx, next) => {
        ctx.body = ctx.pagination;
    });

/**
 * Fetch the main fields of a post.
 */
router.get('/posts/:post_id',
    async ctx => {
        ctx.body = await Post.findById(ctx.params.post_id).select({content: false});
    });

/**
 * Fetch the content of a post.
 */
router.get('/posts/:post_id/content',
    async ctx => {
        const currentPost = await Post.findById(ctx.params.post_id).select({content: true});
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
            descendants: []
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
            if (!body[key]) {
                delete body[key];
            }
        });

        ctx.body = await Post.findOneAndUpdate({
            _id: ctx.params.post_id,
            author: ctx.passport.user._id
        }, Object.assign({}, body), {
            new: true,
            fields: {content: false}
        });
    }
);

/**
 * Delete a post.
 */
router.delete('/posts/:post_id',
    async ctx => {
        try {
            await Post.findOneAndRemove({
                _id: ctx.params.post_id,
                author: ctx.passport.user._id
            });
        } catch (error) {
            throw error;
        }
        ctx.status = 204;

    });


export default router.routes();