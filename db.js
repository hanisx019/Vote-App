const mongoose = require('mongoose')
require('dotenv').config()
const LOCALURLMONGODB = process.env.LOCALURLMONGODB 
const URL=LOCALURLMONGODB
mongoose.connect(URL)
const db=mongoose.connection

db.on('connected',()=>{
    console.log("MongoDB Database Connected")
})

db.on('disconnected',()=>{
    console.log("MongoDB Database Disconnected")
})

module.exports=db