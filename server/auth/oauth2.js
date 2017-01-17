'use strict';

import { createServer, exchange } from 'oauth2orize-koa';
import User from '../models/user';
import { getHash } from '../utils';
import AccessToken from '../models/access-token';

const server = createServer();

server.exchange(
    exchange.password(async (client, username, password) => {
        const user = await User.findOne({
            username,
            hashed_password: getHash(password)
        });
        if (!user) return false;

        await AccessToken.findOneAndRemove({ user: user._id });

        return [await AccessToken.create({
            token: getHash((Math.random() * 100).toString()) + 'daddy',
            user: user._id,
            created_at: Date.now()
        }), null, {user}];
    })
);

export default server;