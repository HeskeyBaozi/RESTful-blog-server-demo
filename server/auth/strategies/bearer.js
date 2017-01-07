'use strict';
import AccessToken from '../../models/access-token';


import {Strategy as BearerStrategy} from 'passport-http-bearer';

export function registerBearer(passport) {
    passport.use('bearer', new BearerStrategy(async(token, done) => {
        try {
            const accessToken = await AccessToken.findOne({token}).populate('user_id');
            if (!accessToken) return done(null, false);
            return done(null, accessToken.user_id, {scope: '*'});
        } catch (error) {
            done(error);
        }
    }));
}
