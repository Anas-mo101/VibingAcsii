const mongoose = require('mongoose');
const NSchema = mongoose.Schema;

const nftSchema = new NSchema({
    name: 
    {
        type: String,
        required: true,
    },
    desc: 
    {
        type: String,
        required: true,
    },
    image:
    {
        type: String,
        required: true,
    },
    url:
    {
        type: String,
        required: true,
    },
    price:
    {
        type: String,
        required: true,
    },
});


const VaNft = mongoose.model('nft', nftSchema);
module.exports = VaNft;