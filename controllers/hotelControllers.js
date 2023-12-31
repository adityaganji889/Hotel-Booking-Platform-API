const Hotel = require("../models/hotelModel");
const User = require("../models/userModel")


const getAllHotels = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if (user) {
          const hotels = await Hotel.find();
          if (hotels.length!=0) {
            res.status(200).send({
              data: hotels,
              message: `All hotels fetched successfully.`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No hotels to display.`,
              success: false,
            });
          }
        } else {
          res.status(401).send({
            data: null,
            message: `Not a logged in user. Can't process the request.`,
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

const getHotelById = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if (user) {
          const hotelToFind = await Hotel.findOne({ _id: req.params.id });
          if (hotelToFind) {
            res.status(200).send({
              data: hotelToFind,
              message: `Hotel with id: ${hotelToFind._id} is fetched successfully`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No hotel with id: ${hotelToFind._id} exists.`,
              success: false,
            });
          }
        } else {
          res.status(401).send({
            data: null,
            message: `Not a logged in user. Can't process the request.`,
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

const addHotel = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userid });
      if (user && user.role==="admin") {
        const hotel = await Hotel.findOne({
          name: req.body.name,
          city: req.body.city
        });
        if (hotel) {
          res.status(403).send({
            data: null,
            message: `Hotel with name: ${hotel.name} already exists.`,
            success: false,
          });
        } else {
          try {
            const newHotel = new Hotel(req.body);
            await newHotel.save();
            res.status(200).send({
              data: null,
              message: `Hotel with name: ${req.body.name} is added successfully.`,
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
      } else {
        res.status(401).send({
          data: null,
          message: "Not an admin user. Can't process the request.",
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
  
  const editHotelById = async (req, res) => {
      try {
        const user = await User.findOne({ _id: req.body.userid });
        if (user && user.role==="admin") {
          let hotel = await Hotel.findOne({ _id: req.params.id });
          if (hotel) {
            hotel.name = req.body.name;
            hotel.city = req.body.city;
            hotel.availableRooms = req.body.availableRooms;
            await hotel.save();
            res.status(200).send({
              data: null,
              message: `Hotel with id : ${hotel._id} is updated successfully.`,
              success: true,
            });
          } else {
            res.status(404).send({
              data: null,
              message: `Hotel with id : ${req.params.id} doesnot exists.`,
              success: false,
            });
          }
        }
        else {
          res.status(401).send({
            data: null,
            message: "Not logged in user/trying to update hotel details. Can't edit the requested hotel details.",
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
  
    const deleteHotelById = async (req, res) => {
      try {
        const user = await User.findOne({ _id: req.body.userid });
        if (user && user.role==="admin") {
          let hotel = await Hotel.findOne({ _id: req.params.id });
          if (hotel) {
            await Hotel.deleteOne({ _id: hotel._id });
            res.status(200).send({
              data: null,
              message: `Hotel with id : ${hotel._id} is deleted successfully.`,
              success: true,
            });
          }
          else {
            res.status(404).send({
              data: null,
              message: `Hotel with id : ${req.params.id} doesnot exists.`,
              success: false,
            });
          }
        } 
        else {
          res.status(401).send({
            data: null,
            message: "Not logged in user/trying to delete hotel details. Can't delete the requested hotel.",
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
  
module.exports = { getAllHotels, getHotelById, addHotel, editHotelById, deleteHotelById }