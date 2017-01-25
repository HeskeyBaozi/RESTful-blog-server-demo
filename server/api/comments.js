'use strict';

import Router from 'koa-router';
import Comment from '../models/comment';
import Post from '../models/post';
import { isBearerAuthenticated } from '../auth';

const router = new Router();

router.use(isBearerAuthenticated());

router.get('/comments',
    async ctx => {
        const post_id = ctx.query.post_id;
        ctx.body = await Post.findById(post_id)
            .select('descendants')
            .populate({
                path: 'descendants',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });
    });

router.post('/comments',
    async ctx => {
        const body = ctx.request.body;
        const currentPost = await Post.findById(body.post_id);
        if (currentPost) {
            const createdComment = await Comment.create({
                content: body.content,
                ascendant: currentPost._id,
                author: ctx.passport.user._id,
                created_at: Date.now()
            });

            await currentPost.descendants.push(createdComment._id);
            await currentPost.save();
            ctx.body = await Comment.populate(createdComment, { path: 'author', select: 'username' });
        } else {
            ctx.status = 400;
        }
    });

router.patch('/comments/:comment_id',
    async ctx => {
        const body = ctx.request.body;
        Object.keys(body).forEach(key => {
            if (!body[key] && key !== 'visible') {
                delete body[key];
            }
        });
        const conditions = ctx.passport.user.ability === 'super' ? { _id: ctx.params.comment_id } : {
            _id: ctx.params.comment_id,
            author: ctx.passport.user._id
        };

        ctx.body = await Comment.findOneAndUpdate(conditions, { $set: body }, {
            new: true,
            populate: { path: 'author', select: 'username' }
        });
    });

router.delete('/comments/:comment_id',
    async ctx => {
        const toDelete = await Comment.findOneAndRemove({
            _id: ctx.params.comment_id,
            author: ctx.passport.user._id // promised that you should be the owner of the comment.
        });

        const updatedPost = await Post.findByIdAndUpdate(toDelete.ascendant, {
            $pull: { descendants: toDelete._id }
        }, { new: true, fields: { descendants: true } });

        ctx.body = { updatedCommentsList: updatedPost };
    });

export default router.routes();