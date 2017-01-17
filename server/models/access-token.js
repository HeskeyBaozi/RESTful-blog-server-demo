'use strict';

import mongoose, {Schema} from 'mongoose';
const duration = 60 * 60 * 24 * 7; // 7days

const accessTokenSchema = new Schema({
    token: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    },
    created_at: {
        type: Date,
        expires: duration,
        required: true,
        default: Date.now()
    },
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.token_id = ret._id;
            delete ret._id;
            delete ret.id;
        },
    }
});

accessTokenSchema.virtual('expires_at')
    .get(function () {
        return new Date(this.created_at.getTime() + (duration * 1000));
    });

accessTokenSchema.virtual('expires_in')
    .get(function () {
        const expirationTime = this['expires_at'].getTime();
        return Number.parseInt((expirationTime - Date.now()) / 1000, 10);
    });

export default mongoose.model('AccessToken', accessTokenSchema);
