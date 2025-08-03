const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,  
    },                                     
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        // unique:true,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})

// Middleware to hash the password before saving the user document,it ensures that the password is stored securely in the database
userSchema.pre('save',async function(next){
    const User = this // this refers to the current user document being saved

    // If the password is not modified, skip hashing ,this prevents re-hashing the password if it hasn't changed
    if(!User.isModified('password'))return next()
    try {
        const salt = await bcrypt.genSalt(10)// Generating a salt for hashed password
        const hashedPassword = await bcrypt.hash(User.password,salt) // Hashing the password with the generated salt
        User.password=hashedPassword // Updating the password field with the hashed password
        next()
    } catch (error) {
        return next(error)
    }
})
// Method to compare the candidate password with the stored hashed password, it is used during user login to verify the password
userSchema.methods.comparePassword=async function(candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword,this.password)// Comparing the candidate password with the stored hashed password
        return isMatch 
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('User',userSchema)
module.exports=User