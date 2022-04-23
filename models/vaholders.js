const mongoose = require('mongoose');
const ASchema = mongoose.Schema;

const holderSchema = new ASchema({
    name: 
    {
        type: String,
        required: true,
        unique: true
    },
    wid: 
    {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});


const Holder = mongoose.model('holder', holderSchema);
module.exports = Holder;