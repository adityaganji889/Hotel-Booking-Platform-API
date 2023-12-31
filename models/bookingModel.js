const mongoose = require('mongoose');
const Hotel = require("../models/hotelModel");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotels',
    required: true,
  },
  checkin: {
    type: Date,
    required: true,
    validate: [
      {
        validator: isValidDate,
        message: props => `${props.value} is not a valid date.`,
      },
      {
        validator: isFutureDate,
        message: 'Checkin date must be in the future.',
      },
    ],
  },
  checkout: {
    type: Date,
    required: true,
    validate: [
      {
        validator: isValidDate,
        message: props => `${props.value} is not a valid date.`,
      },
      {
        validator: isFutureDate,
        message: 'Checkout date must be in the future.',
      },
      {
        validator: isGreaterThanCheckin,
        message: 'Checkout date must be greater than checkin date.',
      },
    ],
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 0
  }
},{
    timestamps: true
});

// Custom validation function for date format
function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
  }
  
  // Custom validation function for future dates
  function isFutureDate(value) {
    const currentDate = new Date();
    return value > currentDate;
  }
  
  // Custom validation function for ensuring checkout is greater than checkin
  function isGreaterThanCheckin(value) {
    return this.checkin < value;
  }

//reduce the number of available rooms in a hotel after booking a room is done in it
bookingSchema.pre('save',async function (next){
    try {
        // Retrieve the hotel associated with the booking
        const hotel = await Hotel.findById(this.hotelId);
    
        // Check if the hotel exists
        if (!hotel) {
          throw new Error('Hotel not found');
        }
    
        // Check if the hotel has enough available rooms
        if (hotel.availableRooms < this.numberOfGuests) {
          throw new Error('Not enough available rooms in the hotel');
        }
    
        // Reduce the number of available rooms
        hotel.availableRooms -= this.numberOfGuests;
    
        // Save the updated hotel document
        await hotel.save();
    
        next();
      } catch (error) {
        next(error);
      }
});

const bookingModel = mongoose.model('bookings', bookingSchema);

module.exports = bookingModel;