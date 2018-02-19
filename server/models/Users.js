var mongoose = require('mongoose');
var Users = mongoose.model('Users',{
    username:{
        type: String,
        minlength: 1,
    },
    email:{
        type: String,
        minlength:1,
        trim:true,
        require: true
    },
    password:{
        type: Number,
        minlength:1,
        required: true,
        trim: true
    }
 });
 
module.exports = {Users};