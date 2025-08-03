const express = require('express')
const app = express()
const db = require('./db')

const bodyParser=require('body-parser')
app.use(bodyParser.json())

require('dotenv').config()
const PORT = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send("Hello World")
})

// Importing user routes and using user routes
const userRoutes = require('./routes/userRoute')
app.use('/user',userRoutes)

// Importing candidate routes and using candidate routes
const candidateRoutes = require('./routes/candidateRoute')
app.use('/candidate',candidateRoutes)

app.listen(PORT,()=>{
    console.log(`App Listening on Port ${PORT}`)
})
