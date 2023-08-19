const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
require("dotenv").config()//required for importing and using the keys in .env
const trainSchema = new mongoose.Schema({
    trainName:{
        type:String,
        required:true
    },
    trainNumber:{
        type:String,
        required:true
    },
    departureTime:{
        hours:{
            type:String,
            required:true
        },
        minutes:{
            type:String,
            required:true
        },
        seconds:{
            type:String,
            required:true
        },
    },
    seatsAvailable:{
        sleeper:{
            type:String,
            required:true
        },
        ac:{
            type:String,
            required:true
        }
    },

    price:{
        sleeper:{
            type:String,
            required:true
        },
        ac:{
            type:String,
            required:true
        }
    },
    delayedBy:{
        type:String,
        required:true
    }






})


const trainRegister = new mongoose.model("trainRegister",trainSchema)
module.exports = trainRegister//Register is the collection name