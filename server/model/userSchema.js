const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
require("dotenv").config()//required for importing and using the keys in .env
const userSchema = new mongoose.Schema({

    companyName:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    rollNo:{
        type:String,
        required:true
    },
    ownerEmail:{
        type:String,
        required:true
    },
    accessCode:{
        type:String,
        required:true
    },
    clientId:{
        type:String,
        required:true
    },
    clientSecret:{
        type:String,
        required:true
    },
    clientSecretHash:{
        type:String,
        required:true
    },



})



userSchema.pre('save',async function(next) {//means before .save method its goinng to be called
    
    if(this.isModified('clientIdHash')){//if password is modified then only hashin takes place
        console.log("hello from inside bcrypt")
        this.clientSecretHash = await bcrypt.hash(this.clientSecret,12)
    }
    next()
})

userSchema.methods.generateAuthToken = async function(){
    try{
        console.log("SECRET_KEY is" ,process.env.REACT_APP_SECRET_KEY)
        let tokenGenerated =  jwt.sign({_id:this._id},process.env.REACT_APP_SECRET_KEY)//as id is unique
        this.tokens = this.tokens.concat({token:tokenGenerated})//adding in token object of tokens
        const isSaved = await this.save();
        if(isSaved){
            console.log("token generated and added");
            
        }else{
            console.log("something wrong with token generation");
        }
        return tokenGenerated;
     }catch(error){
        console.log(error)
    }
}

const Register = new mongoose.model("Register",userSchema)
module.exports = Register//Register is the collection name