const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
//for generating token
const jwt=require('jsonwebtoken');
require('dotenv').config();
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    profile:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    Carts:[
        {
            pid:{
                type:Number,
                required:true
            },
            pquantity:{
                type:Number,
                default:1,
            }
        }
    ],
    messages:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phone:{
                type:Number,
                required:true
            },
            message:{
                type:String,
                required:true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


//hasing the passwrod before saving the data
userSchema.pre('save',async function (next){
    if(this.isModified('password')){//isModified state that whether the password or any parameter is not updeted or updetaed alredy, if not updated give true
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }
    next();
});


//generating token and adding them to database
userSchema.methods.generateAuthToken=async function(){
    try {
        let token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

//addto cart funciton

userSchema.methods.addtoCart=async function(pid){
    try{
        console.log('add to cart is cart is called form userschema '+pid);
        const ispresent=this.Carts.find((data,i)=>{
            
            if(data.pid==pid){
                console.log("data.pid "+data.pid);
                return this.Carts[i];
            }
        });
        console.log(ispresent);
        if(ispresent){
            console.log("matched....................................................................................................")
            ispresent.pquantity=ispresent.pquantity+1;
        }else{
            this.Carts=this.Carts.concat({pid});
        }
        
        await this.save();
        console.log('addtocart is cart save');
        return this.Carts;
    }catch(err){
        console.log("give error form addtocart in userschema")
        console.log(err);
    }
}


//delte from cart

userSchema.methods.deleteproduct=async function(pid){
    try{
        console.log('delete from cart is called form userschema '+pid);
        const ispresent=this.Carts.find((data,i)=>{
            if(data.pid==pid){
                console.log("data.pid "+data.pid);
                return this.Carts[i];
            }
        });
        console.log(ispresent);
        console.log("matched.......")
        this.Carts.pull(ispresent);
        await this.save();
        console.log("save data");
        console.log('delete form cart save');
        // return this;
    }catch(err){
        console.log("give error form deleteproduct in userschema")
        console.log(err);
    }
}
//creating model

//add message to user

userSchema.methods.addMessage=async function (name,email,phone,message){
    console.log("addMessage is clled from userSchema");
    try {
        this.messages=this.messages.concat({name,email,phone,message});
        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error);
    }
}

const User=mongoose.model('USER',userSchema);

module.exports=User; 