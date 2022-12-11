const mongoose = require("mongoose");

const resourcesSchema = mongoose.Schema({
    course: {
        type:String,
        required:true
    },
    type: {
        type:String,
        required:true
    },
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
    },
    likes: {
        type:String,
    },
    username: {
        type:String,
        required:true
    },
    document: {
        type:String,
    }
});
const Resource = mongoose.model("Resource", resourcesSchema);

module.exports = Resource;