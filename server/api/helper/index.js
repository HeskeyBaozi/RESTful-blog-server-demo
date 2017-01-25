'use strict';
import { abilityType } from '../../constant';


export function createPagination(model, getterOptions, defaultOptions) {

    const limitDefault = defaultOptions.limit || 10;
    const pageDefault = defaultOptions.page || 1;
    const projection = getterOptions.projection || {};

    return async function (ctx, next) {
        const conditions = ctx.state && ctx.state.conditions || {};
        const per_page = ctx.query.limit ? Number.parseInt(ctx.query.limit) || limitDefault : limitDefault;
        const page = ctx.query.page ? Number.parseInt(ctx.query.page) : pageDefault;
        const total = await model.count(conditions);

        /**
         * The Pagination Object
         * @name pagination
         * @type {{paging: {per_page: number, page: number, total: number, pages: number}, data: (*)}}
         */
        ctx.pagination = {
            paging: {
                per_page,
                page,
                total,
                pages: Math.floor((total - 1) / per_page) + 1,
            },
            data: await model.find(conditions, projection, {
                limit: per_page,
                skip: (page - 1) * per_page
            }).populate({ path: 'author' }).sort({ created_at: -1 })
        };
        await next();
    }
}