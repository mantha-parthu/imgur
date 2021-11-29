// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ImageSchema = new Schema({
    imageName : String,
    imageId : Number,
    views: Number,
    likes: Number,
    comments: String
});
module.exports = mongoose.model('Image', ImageSchema);