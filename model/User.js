const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const passportLocalMongoose = require("passport-local-mongoose");

const usersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    occupation:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

//checks whether password is newly created so it will only hash new passwords instead of renewed ones
usersSchema.pre("save",function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

//compare password
/* usersSchema.methods.comparePassword = function(plainText, callback){
    return callback(nul, bcrypt.compareSync(plainText, this.password))
} */

usersSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", usersSchema);
module.exports = User;