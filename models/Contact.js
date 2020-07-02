const mongoose = require('mongoose');
const {Schema} = mongoose;

const ContactSchema = new Schema({
    contactName: {type: String, required: true},
    contactLastname: {type: String, required: true},
    contactEmail: {type: String, required: true},
    contactBirthday : {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = mongoose.model('Contact', ContactSchema);