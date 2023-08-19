const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Register = require("./model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cookieParser = require("cookie-parser");


require("dotenv").config();


const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const mongoUrl = process.env.MONGO_DB_URL;
//console.log(`rthe mongo db url is ${mongoUrl}`)
mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on("error", () => {
  console.log("error in connection with database");
});
db.once("open", () => {
  console.log("Connected to database");
});


app.get("/",(req,res)=>{
    // res.send("Hello from server")
    res.set({
        "Allow-access-Allow-Origin" : "*"
       // "Access-control-allow-origin" : "*"
    })
}).listen(3000);


app.post("/register",async(req,res)=>{

    const {companyName,ownerName,rollNo,ownerEmail,accessCode,clientId,clientSecret} = req.body;
    if( !companyName || !ownerName || !rollNo || !ownerEmail || !accessCode || !clientId || !clientSecret){
        res.status(422).send("Please fill all the fields")
        console.log("Please fill all the fields");
    }
    let clientIdHash = clientId;

    const userExist = await Register.findOne({ownerEmail:ownerEmail})
    if(userExist){
        console.log("User already exists")
        return res.status(422).json("email already exists")
    }
    const registerUser  =  new Register({companyName,ownerName,rollNo,ownerEmail,accessCode,clientId,clientSecret,clientIdHash})
    //here before saving hashing of the password is going to take place see in userShema using bcrypt
    
    const registered = await registerUser.save();
    console.log(registered)
    if(registered){
    console.log("added the data into mongo db successfully and given status 200")
    return res.status(200).json("sent requets 200")}else{
        console.log("unable to add data to mongodb")
    }
})



app.post("/auth",async(req,res)=>{
    try{
        const {companyName,clientId,ownerName,ownerEmail,rollNo,clientSecret} = req.body;
        
        const isUserExist = await Register.findOne({clientId:clientId})//Register is the name of the collections findOne is a mongoose method
        if(isUserExist){
            const isMatching = await bcrypt.compare(clientSecret,isUserExist.clientSecretHash)
            
            if(isMatching){
                //console.log("user sign in successfully")
                
                const token = await isUserExist.generateAuthToken()//we are now generating auth token that is in userSchema
                //console.log("token",token)
                res.cookie("jwtoken",token,{
                    maxAge:1682629264,//token is active for 2592000000 millisec ie 30 days after that he will be logged out expires is not working please take a note
                    httpOnly:true
                }).status(200).end()
                // res.status(200).json("user sign in successfully")
            }else{
                console.log("user cannot sign i email is theren ",isMatching)
                res.status(422).json("user cannot sign in")
                
            }}else{
                console.log("user cannot sign in email not there")
                res.status(422).json("user cannot sign in")
                
            }
            
            console.log("user exist",isUserExist)//gives data in json format of the collectin with given email id
            res.status(200).json(`{
                "token_type" : "Bearer",
                "access_token" : "${token}",
                "expires_in" : "1682629264"
            }`)
        }catch(error){console.log(error)}
    });


    app.get("/trains",async (req,res)=>{
        
        try {
            const trains = await trainRegister.find(); // Retrieve all documents from the trainRegister collection
        
            res.json(trains); // Send the retrieved documents as a JSON response
          } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
          }
        });
    app.post("/trains",async(req,res)=>{

        const {trainName,trainNumber,departureTime,seatsAvailable,price,delayedBy} = req.body;
        if( !trainName || !trainNumber || !departureTime || !seatsAvailable || !price || !delayedBy){
            res.status(422).send("Please fill all the fields")
            console.log("Please fill all the fields");
        }
    
        const trainExist = await Register.findOne({trainNumber:trainNumber})
        if(trainExist){
            console.log("train already exists")
            return res.status(422).json("email already exists")
        }
        const registerTrain  =  new trainRegister({trainName,trainNumber,departureTime,seatsAvailable,price,delayedBy})
        //here before saving hashing of the password is going to take place see in userShema using bcrypt
        
        const registered = await registerTrain.save();
        console.log(registered)
        if(registered){
        console.log("added the data into mongo db successfully and given status 200")
        return res.status(200).json("sent requets 200")}else{
            console.log("unable to add data to mongodb")
        }

        
    })
    app.get(`/trains/${no}`,async(req,res)=>{
        let trainNo = no
        let isTrainExist = await trainRegister.findOne({trainNumber:trainNo});
        if(!isTrainExist){
            res.status(422).json("train does'nt exist")
        }
        else{
            res.status(200).json(`{
                "trainName" : "${isTrainExist.trainName}",
                "trainNumber" : "${isTrainExist.trainNumber}",
                "departureTime" : "${isTrainExist.departureTime}",
                "seatsAvailable" : "${isTrainExist.seatsAvailable}",
                "price" : "${isTrainExist.price}",
                "delayedBy" : "${isTrainExist.delayedBy}",
                
            }`)
        }

    })