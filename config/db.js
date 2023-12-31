const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connectionDb = mongoose.connection;

connectionDb.on('error',(err)=>{
    console.log(err);
})

connectionDb.on('connected',()=>{
    console.log("Connected to Database Successfully.");
})

module.exports = connectionDb;