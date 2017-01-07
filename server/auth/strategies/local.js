'use strict';

import {getHash} from '../../utils';
import {Strategy as LocalStrategy} from 'passport-local';

export function registerLocal(passport) {
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async(username, password, done) => {
        try {
            const user = await User.findOne({username});
            if (!user) {
                return done(null, false);
            }
            if (getHash(password) === user.hashed_password) {
                return done(null, user);
            }
        } catch (error) {
            done(error);
        }
    }));
}



