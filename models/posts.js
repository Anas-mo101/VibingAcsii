const mongoose = require('mongoose');
const PSchema = mongoose.Schema;

const postSchema = new PSchema({
    id: 
    {
        type: String,
        required: true,
    },
    pTitle: 
    {
        type: String,
        required: true,
    },
    pDate:
    {
        type: String,
        required: true,
    },
    pText:
    {
        type: String,
        required: true,
    },
    pAuthor:
    {
        type: String,
        required: true,
    },
    pLikes:
    [
        {
            name: 
            {
                type: String,
                required: true,
            },
            wid: 
            {
                type: String,
                required: true,
            }
        }
    ],
    pDislikes:
    [
        {
            name: 
            {
                type: String,
                required: true,
            },
            wid: 
            {
                type: String,
                required: true,
            }
        }
    ],
    pComments:
    [
        {
            cDate:
            {
                type: String,
                required: true,
            },
            cText:
            {
                type: String,
                required: true,
            },
            cAuthor:
            {
                type: String,
                required: true,
            }
        }
    ]
}, {timestamps: true});


const FeedPosts = mongoose.model('post', postSchema);
module.exports = FeedPosts;