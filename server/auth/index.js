'use strict';

import passport from 'koa-passport';
import User from '../models/user';


import {registerLocal} from './strategies/local';
import {registerBearer} from './strategies/bearer';


passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser(async(username, done) => {
    done(null, await User.findOne({username}));
});

registerLocal(passport);
registerBearer(passport);


export function isLocalAuthenticated() {
    return passport.authenticate('local', {session: false});
}


export function isBearerAuthenticated() {
    return passport.authenticate('bearer', {session: false});
}

export default passport;
