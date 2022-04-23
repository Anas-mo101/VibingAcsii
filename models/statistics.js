const mongoose = require('mongoose');
const SSchema = mongoose.Schema;

const statisticsSchema = new SSchema({
    frontpageVisits: 
    {
        type: Number,
        required: true,
    },
    galleryVisits:
    {
        type: Number,
        required: true,
    },
    holderVisits:
    {
        type: Number,
        required: true,
    },
    osDirects:
    {
        type: Number,
        required: true,
    },
}, {timestamps: true});


const Statistic = mongoose.model('statistic', statisticsSchema);
module.exports = Statistic;