const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/user");
const { jwtAuthMiddleware,generateToken } = require('../jwt')

// Middleware to check if the user is an admin
const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID)// Searching for user in the database using userID
        return user.role=="admin"
    } catch (error) {
        return false
    }
}

// This route is used to create a new candidate :/
router.post("/", jwtAuthMiddleware,async (req, res) => {
  try {
    if(! await checkAdminRole(req.user.id)){
        console.log("Access Denied: Admins only")
        return res.status(403).json({message:'Access Denied: Admins only'})
    }else{
        console.log("Access Granted: Admin")
    }
    const Data = req.body; // request body conatins user's entered data
    const candidateData = new Candidate(Data); // store candidate data along with schema in new document
    const dataDB = await candidateData.save(); // saving user data in databse
    console.log("Information Stored Successfully");
    res.status(200).json({ response: dataDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server not found '});
  }
})

// This  route is to update candidate information /:candidateID
router.put("/:candidateID",jwtAuthMiddleware,async(req, res) => {
    try {
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'Access Denied: Admins only'})
        }
        const candidateID = req.params.candidateID // Extracting candidateID from the request parameters
        const updatedCanididateData = req.body // Extracting updated candidate data from the request body
        // Check if the candidateID is valid
        const response = await User.findByIdAndUpdate(candidateID,updatedCanididateData,{
            new:true,// Returns the updated document
            runValidators:true,// Ensures that the updated data adheres to the schema validation rules
        })
        if(!response){
            return res.status(404).json({error:"Candidate not found"})
        }
        console.log("Data Updated Succesfully")
        res.status(200).json(response);  
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Server not found'});
    }
});

// This route is to delete candidate information /:candidateID
router.delete("/:candidateID",jwtAuthMiddleware,async(req, res) => {
    try {
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:'Access Denied: Admins only'})
        }
        const candidateID = req.params.candidateID // Extracting candidateID from the request parameters
        // Check if the candidateID is valid
        const response = await User.findByIdAndDelete(candidateID)
        console.log("Candidate Deleted Succesfully")
        res.status(200).json(response);  
        
        if(!response){
            return res.status(404).json({error:"Candidate not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Server not found'});
    }
});

router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
  candidateID = req.params.candidateID; // Extracting candidateID from request parameters and storing it in a variable
  userId = req.user.id; // Extracting userId from the decoded token data
  try {
      if(!user){
        return res.status(404).json({message:'user not found'})
      }
      if(user.isVoted){
        return res.status(400).json({message:'You have already voted'})
      }
      if(user.role=='admin'){
        return res.status(403).json({message:'Admin cannot vote'})
      }

      candidate.votes.push({user:userId})
      candidate.votesCount++;
      await candidate.save(); // Saving the updated candidate data in the database

      user.isVoted = true; // Updating the user's isVoted status to true
      await user.save(); // Saving the updated user data in the database
      res.status(200).json({message:'Vote casted successfully'}) // Sending success response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server not found' });
    
  }
}); 

router.get('/vote/count',async (req,res)=>{
  try {
     const candidate = await Candidate.find().sort({voteCount:'desc'}) 
     const voteRecord= candidate.map((data)=>{
      return{
        party: data.party,
        count: data.votesCount
      }
     });
     return res.status(200).json(voteRecord) // Fetching vote count of each candidate from the database


  } catch (error) {
    res.status(500).json({error:'Server not found'})
  }
})

module.exports = router;
