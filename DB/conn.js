const mongoose = require('mongoose');
require('dotenv').config();
// const DB='mongodb://kaif:78907890@ac-dlslanq-shard-00-00.lfgro4b.mongodb.net:27017,ac-dlslanq-shard-00-01.lfgro4b.mongodb.net:27017,ac-dlslanq-shard-00-02.lfgro4b.mongodb.net:27017/kaifmern?ssl=true&replicaSet=atlas-xg270w-shard-0&authSource=admin&retryWrites=true&w=majority';
const DB=process.env.DATABASE;
mongoose.connect(DB,{
    useUnifiedTopology:true,useNewUrlParser: true
}).then(()=>{
    console.log('connection successful');
}).catch((err)=>console.log('no connection'+err));