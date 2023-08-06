const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');

//for token generation
const jwt=require('jsonwebtoken');
require('dotenv').config();

//requre pages
require('../DB/conn');
const User=require('../models/userSchema');
const authenticate=require('../middleware/authenticate');


router.get('/',(req,res)=>{
    res.send('Hi thsi is hove form server auth.js');
});

//signup logic
router.post('/register',async (req,res)=>{
    console.log("/register is called from auth");
    const {name,email,phone,profile,address,password,cpassword}=req.body;
    // console.log(req.body);
   console.log("register  is called from auth");
    if(!name || !email || !phone || !profile || !address ||!password || !cpassword){
        console.log("incomplete section");
        return res.status(422).json({error: "Plz filled the field properly"});
    }

    try {
        const userExist= await User.findOne({email:email});

        if(userExist){
            console.log("alredy exist");
            return res.status(422).json({error: "Email is already Exist"});
        }else if(password!=cpassword){
            console.log("password not match");
            return res.status(422).json({error: "Password and confirm password not matched"});
        }else{
            const user=new User({name,email,phone,profile,address,password,cpassword});
            console.log(user);
            await user.save();
            // window.alert("data saved");
            console.log("data saved");
            res.status(201).json({message: "user registered successfuly"});
        }
           
    } catch (error) {
        console.log(error);
    }
    
});


//signin logic
router.post('/signin',async (req,res)=>{
    console.log('signin called form auth');
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({error:"fill the data carefully"});
        }
        const userLogin=await User.findOne({email:email});
        if(!userLogin){
            console.log("user not matched");
            return res.status(400).json({error:"user not found"});
        }else{
            //comparing the hash password of the user 
            const isMatch=await bcrypt.compare(password,userLogin.password); 
            
            //token generation
            const token=await userLogin.generateAuthToken(); //generateAuthToken will define at userSchema page
            if(token){
                console.log("token generated Successfully");
                console.log(token);
            }else{
                console.log("no token generated");
            }
            //adding token as cokkie in the web browser to identify that the user is login or not
            //if there is no cokkie in the web browser cookie section the user will assume as logout

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            });

            //cookie added
            console.log("cookie added");
            if(isMatch){
                console.log("login successfull");
                res.status(200).json({message:"user signed in "});
            }else{
                console.log("password not matched");
                return res.status(400).json({error:"userId password not matched"});
            }
        }
    } catch (error) {
        console.log(error);
    }
    
});

router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
});

router.get('/getdata',authenticate,(req,res)=>{
    console.log("get data called");
    console.log(req.rootUser);
    res.send(req.rootUser);
});

//addtoCart calling in userSchema
router.post('/addtocart',authenticate,async(req,res)=>{
    try {
        const {pid}=req.body;
        console.log("addtocart called form auth.sj")
        if(!pid){
            console.log("error in pid form auth js");
            return res.json({error:"pid not found"});
        }console.log("addtocart pid is present"+pid)
        const cartuser=await User.findOne({_id:req.rootUser._id});
        console.log("cartuser "+ cartuser);
        if(cartuser){
            const cartelement=await cartuser.addtoCart(pid);
            await cartuser.save();
            console.log("data added to cart");
            res.status(201).json({message:"Successfully data added to cart"}); 
        }else{
            console.log("cartuser not found");
        }
    } catch (error) {
        console.log(error);
    } 
    
})
router.post('/deleteproduct',authenticate,async(req,res)=>{
    try {
        const {pid}=req.body;
        console.log("deleteproduct called form auth.sj")
        
        const cartuser=await User.findOne({_id:req.rootUser._id});
        console.log("cartuser "+ cartuser);
        if(cartuser){
            const cartelement=await cartuser.deleteproduct(pid);
            console.log(cartelement);
            await cartuser.save();
            console.log("product deleted from cart");
            res.status(201).json({message:"Successfully data added to cart"}); 
            // return cartelement;
        }else{
            
            console.log("cartuser not found");
            return res.status(401).json({message:"Successfully data added to cart"}); 
        }
    } catch (error) {
        console.log(error);
    } 
});



// for message contact 
router.post('/contact',authenticate,async(req,res)=>{
    try {
        console.log("contact is called from auth.js");
        const {name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){
            console.log("Error in the contact form");
            return res.json({error:"plaese filled the contact form properly"});
        }
        console.log("no error from contact form");
        console.log("resUserID "+req.UserID);
        const userContact=await User.findOne({_id:req.rootUser._id});
        console.log("userContact 1 "+userContact);
        if(userContact){
            const userMessage=await userContact.addMessage(name,email,phone,message);//this will get the response fronm the addMessage function declare in userSchema.js
            await userContact.save();
            console.log("userMessage"+userMessage);
            console.log("userContact"+userContact);
            res.status(201).json({message:"Successfuly add the message"});
        }else{
            console.log("give error at auth.js in contact");
        }
    } catch (error) {
        console.log(error);
    }
});

//logout the user
router.get('/logout',(req,res)=>{
    console.log('Hello logout page from auth.js');
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User Logout');
});

module.exports=router;