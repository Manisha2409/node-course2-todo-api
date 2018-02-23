const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
    username:{
        type: String,
        minlength: 1,
    },
    email:{
        type: String,
        minlength:1,
        trim:true,
        require: true,
         unique: true,
        validate:{
            validator : validator.isEmail,
            message: `{VALUE} is not vali email`
        }
    },
    password:{
        type: String,
        minlength:6,
        required: true,
        trim: true
        },
        tokens:[{
            access: {
                type: String,
                required : true
            },
            token:{
                type: String ,
                required: true
                
            }
        }]
 });

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,['_id','email']);
}



UserSchema.methods.generateAuthToken =  function (){
    var user = this;
    var access =  'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
 
    return user.save().then(()=>{
        return token;
    });

};

var Users = mongoose.model('Users',UserSchema);
 
module.exports = {Users};
 