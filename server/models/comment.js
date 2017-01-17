'use strict';

import mongoose, {Schema} from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    ascendant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    versionKey: false,
    toJSON: {
        transform(doc, ret){
            ret.v = ret.__v;
            ret.comment_id = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    }
});

export default mongoose.model('Comment', commentSchema);