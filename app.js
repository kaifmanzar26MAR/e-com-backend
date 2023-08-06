const express=require('express');
require('./DB/conn');
const cookieParser=require('cookie-parser');
const cors=require('cors');

const PORT=process.env.PORT || 4000;
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(require('./router/auth'));

app.use(cors());

const path=require('path');

app.get('/',(req,res)=>{
    res.send("Hello world form the server app.js");
})
app.get('/signin',(req,res)=>{
    res.send("Welcome to signin page");
})  
app.get('/signup',(req,res)=>{
    res.send("Welcome to signup page");
})  

//static files access for hosting
app.use(express.static(path.join(__dirname,'./client/build')));
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} port`);
})