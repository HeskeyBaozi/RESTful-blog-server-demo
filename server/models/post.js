'use strict';

import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    descendants: {
        type: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Comment'
        }]
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    visible: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    toJSON: {
        virtuals: true,
        transform(doc, ret){
            ret.post_id = ret._id;
            ret.v = ret.__v;
            delete ret._id;
            delete ret.__v;
            delete ret.id;
        }
    }
});

export default mongoose.model('Post', postSchema);