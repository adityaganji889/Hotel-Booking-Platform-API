const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");

const getAllBookings = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if (user && user.role==="admin") {
          const bookings = await Booking.find();
          if (bookings.length!=0) {
            res.status(200).send({
              data: bookings,
              message: `All bookings fetched successfully.`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No bookings to display.`,
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

const getAllBookingsOfUser = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if (user) {
          const bookings = await Booking.find({ userId: user._id });
          if (bookings.length!=0) {
            res.status(200).send({
              data: bookings,
              message: `All bookings of user: ${user.name} fetched successfully.`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No bookings to display.`,
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

const getBookingById = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if ((user && user.role === "admin")||(user._id.toString()==req.body.userid.toString())) {
          const bookingToFind = await Booking.findOne({ _id: req.params.id });
          if (bookingToFind) {
            res.status(200).send({
              data: bookingToFind,
              message: `Booking with id: ${bookingToFind._id} is fetched successfully`,
              success: true,
            });
          } 
          else {
            res.status(404).send({
              data: null,
              message: `No booking with id: ${bookingToFind._id} exists.`,
              success: false,
            });
          }
        } else {
          res.status(401).send({
            data: null,
            message: `Not an admin user/logged in user or trying to view other users bookings. Can't process the request.`,
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

const makeBooking = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid });
    if (user) {
      const booking = await Booking.findOne({
        userId: user._id,
        hotelId: req.body.hotelId,
        checkin: req.body.checkIn,
        checkout: req.body.checkout,
      })
        .populate("hotels")
        .populate("users");
      if (booking) {
        res.status(403).send({
          data: null,
          message: `Booking with hotel: ${booking.hotelId.name}, user: ${booking.userId.name}, checkin: ${booking.checkin}, checkout: ${booking.checkout}  already exists.`,
          success: false,
        });
      } else {
        try {
          req.body.userId = user._id;
          let newBooking = new Booking(req.body);
          await newBooking.save();
          res.status(200).send({
            data: null,
            message: `New Booking is created successfully.`,
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
        message: "Not a logged in user. Can't process the request.",
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

const manageBookingById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid });
    if (user) {
      let booking = await Booking.findOne({ _id: req.params.id });
      if (booking) {
        let hotel = await Hotel.findOne({ _id: booking.hotelId });
        if (hotel) {
          hotel.availableRooms += booking.numberOfGuests;
          await hotel.save();
        } else {
          return res.status(404).send({
            data: null,
            message: `Hotel with id : ${booking.hotelId} is not found.`,
            success: true,
          });
        }
        try {
          booking.checkin = req.body.checkin;
          booking.checkout = req.body.checkout;
          booking.numberOfGuests = req.body.numberOfGuests;
          await booking.save();
          res.status(200).send({
            data: null,
            message: `Booking with id : ${booking._id} is updated successfully.`,
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
      else {
        res.status(404).send({
          data: null,
          message: `Booking with id : ${req.params.id} doesnot exists.`,
          success: false,
        });
      }
    } 
    // if admin user has to edit booking details for any booking then remove comments of the below part and replace user with user && user.role==="customer" in if block above
    // else if(user && user.role==="admin"){
    //     let booking = await Booking.findOne({ _id: req.params.id });
    //     if (booking) {
    //       let hotel = await Hotel.findOne({ _id: booking.hotelId });
    //       if (hotel) {
    //         hotel.availableRooms += booking.numberOfGuests;
    //         await hotel.save();
    //       } else {
    //         return res.status(404).send({
    //           data: null,
    //           message: `Hotel with id : ${booking.hotelId} is not found.`,
    //           success: true,
    //         });
    //       }
    //       try {
    //         booking.checkin = req.body.checkin;
    //         booking.checkout = req.body.checkout;
    //         booking.numberOfGuests = req.body.numberOfGuests;
    //         await booking.save();
    //         res.status(200).send({
    //           data: null,
    //           message: `Booking with id : ${booking._id} is updated successfully by admin user : ${user.name} respectively.`,
    //           success: true,
    //         });
    //       } catch (error) {
    //           res.status(400).send({
    //               data: null,
    //               message: error.message,
    //               success: false,
    //             });
    //       }
    //     } 
    //     else {
    //       res.status(404).send({
    //         data: null,
    //         message: `Booking with id : ${req.params.id} doesnot exists.`,
    //         success: false,
    //       });
    //     }
    // } 
    else {
      res.status(401).send({
        data: null,
        message:
          "Not logged in user/trying to manage booking details. Can't manage the requested booking details.",
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

const cancelBookingById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userid });
    if (user) {
      let booking = await Booking.findOne({ _id: req.params.id });
      if (booking) {
        let hotel = await Hotel.findOne({ _id: booking.hotelId })
        if(hotel){
            hotel.availableRooms+=booking.numberOfGuests;
            await hotel.save();
        }
        else{
            return res.status(404).send({
                data: null,
                message: `Hotel with id : ${booking.hotelId} doesnot exists.`,
                success: false
            })
        }
        await Booking.deleteOne({ _id: booking._id });
        res.status(200).send({
          data: null,
          message: `Booking with id : ${booking._id} is deleted successfully.`,
          success: true,
        });
      } else {
        res.status(404).send({
          data: null,
          message: `Booking with id : ${req.params.id} doesnot exists.`,
          success: false,
        });
      }
    } 
    // if admin user has to delete any blog then remove comments of the below part and replace user with user && user.role==="customer" in if block above 
    // else if(user && user.role==="admin"){
    //     let booking = await Booking.findOne({ _id: req.params.id });
    //     if (booking) {
    //       await Booking.deleteOne({ _id: booking._id });
    //       res.status(200).send({
    //         data: null,
    //         message: `Booking with id : ${booking._id} is deleted successfully by admin user : ${user.name} respectively.`,
    //         success: true,
    //       });
    //     } else {
    //       res.status(404).send({
    //         data: null,
    //         message: `Booking with id : ${req.params.id} doesnot exists.`,
    //         success: false,
    //       });
    //     }
    //   } 
    else {
      res.status(401).send({
        data: null,
        message:
          "Not logged in user/trying to cancel booking details. Can't cancel the requested booking.",
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

module.exports = { getAllBookings, getAllBookingsOfUser, getBookingById, makeBooking, manageBookingById, cancelBookingById }