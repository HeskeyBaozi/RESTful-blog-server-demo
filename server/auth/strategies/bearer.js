'use strict';
import AccessToken from '../../models/access-token';


import {Strategy as BearerStrategy} from 'passport-http-bearer';

export function registerBearer(passport) {
    passport.use('bearer', new BearerStrategy(async(token, done) => {
        try {
            const accessToken = await AccessToken.findOne({token}).populate('user');
            if (!accessToken) return done(null, false);
            return done(null, accessToken.user, {scope: '*'});
        } catch (error) {
            done(error);
        }
    }));
}
