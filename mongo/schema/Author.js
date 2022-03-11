const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorScema = new Schema({
    name : String,
    age : Number,
})

module.exports = mongoose.model('Author', AuthorScema);