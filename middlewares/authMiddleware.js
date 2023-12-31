const jwt = require("jsonwebtoken");

module.exports = async(req,res,next) => {
    try{
       const token = req.headers.authorization.split(" ")[1];
       const decodedUser = jwt.verify(token,process.env.JWT_SECRET);
       req.body.userid = decodedUser.userid;
       next();
    }
    catch(error){
       res.send({
          data: null,
          message: "Invalid or Expired Token",
          success: false
       })
    }
}