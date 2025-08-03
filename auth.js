const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const User = require("./models/user");

passport.use(new LocalStrategy(async(aadhar,password,done)=>{
  try {
    console.log('Recived Credentials',aadhar,password);
    const user = await User.findOne({aadhar:aadhar})
    if(!user)
      return done(null,false,{message:'Incorrect Aadhar Number'})
      const isPasswordMatch = await user.comparePassword(password)
    if(isPasswordMatch){
      return done(null,user)
    }else{
      return done(null,false,{message:'Incorrect Password'})
    }
  } catch (error) {
    return done(error)
  }
}))

module.exports = passport