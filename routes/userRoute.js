const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware,generateToken } = require('../jwt')


// This route is used to register a new user :/signup
router.post("/signup", async (req, res) => {
  try {
    const Data = req.body; // request body conatins user's entered data
    const userData =new User(Data); // store user data along with schema in new document
    const dataDB = await userData.save(); // saving user data in databse
    console.log("Information Stored Successfully");

    // payload contains user info
    const payLoad={
      id:dataDB.id,
    } 
    console.log(JSON.stringify(payLoad)) // converts the payload id to string for better readability
    const token = generateToken(payLoad) // generates a token using payload data 
    console.log("Token is", token )
    res.status(200).json({ response: dataDB ,token:token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server not found '});
  }
});


// This route is used to sign in an existing user :/signin
router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber , password } = req.body; // Extracting aadharCardNumber and password from request body
    const userFound = await User.findOne({aadharCardNumber:aadharCardNumber}) // Searching for user in the database using aadharCardNumber
    console.log("User Data Fetched Succesfully")
    console.log(userFound)
  // check if user exists and if the password matches
    if(!userFound || !(await userFound.comparePassword(password))){
        return res.status(401).json({error:'Invalid Username or Password'})
    }
    const payLoad={
        id:dataDB.id,
    }
    console.log(JSON.stringify(payLoad)) // converts the payload id to string for better readability 
    const token = generateToken(payLoad) // generates a token using payload data
    console.log("Token is", token )
    res.json({token})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server not found '});
  }
});


// This route is used to get the profile of the user :/profile
router.get("/profile",jwtAuthMiddleware,async(req, res) => {
    try {
      const userData = req.user // req.user is a token and contains the decoded token data of a user
      const userId = userData.id() // Extracting user id from the decoded token data
      const userIdFound = await User.findById(userId); // Searching for user in the database using userId
      console.log("Response Fetched Successfully")
        res.status(200).json(userIdFound)        

    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Server not found'})
    }
}); 

// This route is used to update the password of the user :/profile/password
router.put("/profile/password",jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.user.id // req.user is a token and contains the decoded token data of a user and attached with id
        const { currentPassword, newPassword } = req.body; // Extracting oldPassword and newPassword from request body
        const userFound = await User.findById(userId); // Searching for user in the database using userId
        // check if the password matches
        if(!(await userFound.comparePassword(currentPassword))){
          return res.status(401).json({error:'Incorret Password'})
        }
        userFound.password = newPassword; // Updating the password with newPassword
        await userFound.save(); // Saving the updated user data in the database
        console.log("Password Updated Successfully")  
        res.status(200).json({message:'Password Updated Successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Server not found'});
    }
});
 

// This route is used to fetch all user data :/users/
router.get('/', async (req,res)=>{
  try {
    const allUserData = User.find({})
    const allUserDataFound = await allUserData;
    res.status(200).json({response:allUserDataFound}) // Fetching all user data from the database
  } catch (error) {
    res.status(500).json({error:'Server not found'})
  }
})





module.exports = router;
