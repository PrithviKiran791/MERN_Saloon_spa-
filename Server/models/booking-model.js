const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "salons",
      required: true,
    },
    appointmentDate: {
      type: String, // ISO date string (YYYY-MM-DD)
      required: true,
      trim: true,
    },
    startTime: {
      type: String, // HH:mm
      required: true,
      trim: true,
    },
    endTime: {
      type: String, // HH:mm
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model("bookings", bookingSchema);

module.exports = BookingModel;
