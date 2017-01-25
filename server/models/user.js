'use strict';

import mongoose, {Schema} from 'mongoose';
import {abilityType} from '../constant';


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    ability: {
        type: String,
        required: true,
        enum: abilityType
    }
}, {
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.user_id = ret._id;
            delete ret._id;
            delete ret.hashed_password;
        }
    },
});

export default mongoose.model('User', userSchema);