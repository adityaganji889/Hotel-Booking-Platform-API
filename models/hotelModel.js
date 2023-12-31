const mongoose = require("mongoose");
const Booking = require("./bookingModel");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing whitespaces
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    availableRooms: {
      type: Number,
      required: true,
      min: 0, // Minimum value allowed for available rooms
    },
  },
  {
    timestamps: true,
  }
);

// Delete all the bookings of the hotel when a hotel is deleted
hotelSchema.post("deleteOne", async function () {
  const hotel = this._conditions;
  await Booking.deleteMany({ hotelId: hotel._id })
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} bookings`);
    })
    .catch((error) => {
      console.error("Error deleting bookings:", error);
    });
});




const hotelModel = mongoose.model("hotels", hotelSchema);

module.exports = hotelModel;
