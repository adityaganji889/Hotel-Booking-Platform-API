const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(403).send({
        data: null,
        message: `User: ${user.name} already exists.`,
        success: false,
      });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({
          data: null,
          message: `User: ${req.body.name} is registered successfully.`,
          success: true,
        });
      } catch (error) {
        res.status(400).send({
          data: null,
          message: error.message,
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(403).send({
        data: null,
        message: `User: ${user.name} doesnot exists.`,
        success: false,
      });
    } else {
      const isPasswordsMatched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isPasswordsMatched) {
        const dataToSend = {
          userid: user._id,
        };
        const token = jwt.sign(dataToSend, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).send({
          data: token,
          message: `User: ${user.name} is logged in successfully.`,
          success: true,
        });
      } else {
        res.status(400).send({
          data: null,
          message: `Invalid Credentials.`,
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid });
    if (user && user.role === "admin") {
      let userToUpdate = await User.findOne({ _id: req.params.id });
      if (userToUpdate && userToUpdate._id.toString() != user._id.toString()) {
        if (userToUpdate.role === "customer") {
          userToUpdate.role = "admin";
        } else {
          userToUpdate.role = "customer";
        }
        const updatedUser = await userToUpdate.save();
        res.status(200).send({
          data: null,
          message: `Role of user: ${updatedUser.name} is changed to ${
            updatedUser.role === "admin" ? "admin" : "customer"
          } by admin user : ${user.name} respectively.`,
          success: true,
        });
      } else if (userToUpdate._id.toString() == user._id.toString()) {
        res.status(403).send({
          data: null,
          message: `You cannot update your role yourself while logged in as admin user.`,
          success: false,
        });
      } else {
        res.status(404).send({
          data: null,
          message: `User with id : ${req.params.id} doesnot exists.`,
          success: false,
        });
      }
    } else {
      res.status(401).send({
        data: null,
        message: `Not an admin user. Can't process the request.`,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid });
    if (user && user.role === "admin") {
      let userToUpdate = await User.findOne({ _id: req.params.id });
      if (userToUpdate && userToUpdate._id.toString() != user._id.toString()) {
        try {
          userToUpdate.age = req.body.age;
          userToUpdate.gender = req.body.gender;
          const updatedUser = await userToUpdate.save();
          res.status(200).send({
            data: null,
            message: `Details of user: ${updatedUser.name} is updated by admin user : ${user.name} respectively.`,
            success: true,
          });
        } catch (error) {
            res.status(400).send({
                data: null,
                message: error.message,
                success: false,
              });
        }
      } else if (userToUpdate._id.toString() == user._id.toString()) {
        res.status(403).send({
          data: null,
          message: `You cannot update your details yourself while logged in as admin user.`,
          success: false,
        });
      } else {
        res.status(404).send({
          data: null,
          message: `User with id : ${req.params.id} doesnot exists.`,
          success: false,
        });
      }
    } else {
      res.status(401).send({
        data: null,
        message: `Not an admin user. Can't process the request.`,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid });
    if (user && user.role === "admin") {
      let userToDelete = await User.findOne({ _id: req.params.id });
      if (userToDelete && userToDelete._id.toString() != user._id.toString()) {
        // await userToDelete.remove();
        const result = await User.deleteOne({ _id: userToDelete._id });
        console.log(result);
        res.status(200).send({
          data: null,
          message: `User: ${userToDelete.name} is deleted by admin user : ${user.name} respectively.`,
          success: true,
        });
      } else if (userToDelete._id.toString() == user._id.toString()) {
        res.status(403).send({
          data: null,
          message: `You cannot delete your account yourself while logged in as admin user.`,
          success: false,
        });
      } else {
        res.status(404).send({
          data: null,
          message: `User with id : ${req.params.id} doesnot exists.`,
          success: false,
        });
      }
    } else {
      res.status(401).send({
        data: null,
        message: `Not an admin user. Can't process the request.`,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};


const getAllUsers = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if (user && user.role === "admin") {
          const users = await User.find();
          if (users.length!=0) {
            res.status(200).send({
              data: users,
              message: `All users fetched successfully.`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No users to display.`,
              success: false,
            });
          }
        } else {
          res.status(401).send({
            data: null,
            message: `Not an admin user. Can't process the request.`,
            success: false,
          });
        }
    }
    catch(error){
        res.status(500).send({
            data: null,
            message: error.message,
            success: false,
          }); 
    }
}

const getUserById = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if (user && user.role === "admin") {
          const userToFind = await User.findOne({ _id: req.params.id });
          if (userToFind) {
            res.status(200).send({
              data: userToFind,
              message: `User with id: ${userToFind._id} is fetched successfully`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No user with id: ${userToFind._id} exists.`,
              success: false,
            });
          }
        } else {
          res.status(401).send({
            data: null,
            message: `Not an admin user. Can't process the request.`,
            success: false,
          });
        }
    }
    catch(error){
        res.status(500).send({
            data: null,
            message: error.message,
            success: false,
          }); 
    }
}

module.exports = { register, login, updateUserRole, updateUserById, deleteUserById, getAllUsers, getUserById };