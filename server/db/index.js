'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

export function connectDatabase(uri) {
    return new Promise((resolve, reject) => {
        mongoose.connection
            .on('error', error => reject(error))
            .on('close', () => {
                console.log('Database connection closed.');
            })
            .once('open', () => {
                resolve(mongoose.connections[0]);
            });

        mongoose.connect(uri);
    });
}