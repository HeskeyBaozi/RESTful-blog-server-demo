'use strict';

import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    author_id: {
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
    visiable: {
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
            ret.created_at = new Date(ret.created_at).getTime();
            delete ret._id;
            delete ret.__v;
            delete ret.id;
        }
    }
});

export default mongoose.model('Post', postSchema);