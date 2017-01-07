'use strict';

import crypto from 'crypto';

export function getHash(password) {
    if (typeof password === 'string')
        return crypto.createHash('md5').update(password).digest('hex');
}