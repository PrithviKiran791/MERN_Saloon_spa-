const router = require("express").Router();
const middleware = require("../middleware/index.js");
const BookingModel = require("../models/booking-model");
const SalonModel = require("../models/salon-model");

// Check availability for a salon on a specific date and time
router.post("/check-availability", middleware, async (req, res) => {
  try {
    const { salonId, date, time } = req.body;
    
    if (!salonId || !date || !time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const salon = await SalonModel.findById(salonId);
    if (!salon) {
      return res.status(404).json({ success: false, message: "Salon not found" });
    }

    // Check for existing bookings at this time
    const existingBooking = await BookingModel.findOne({
      salon: salonId,
      appointmentDate: date,
      startTime: time,
    });

    if (existingBooking) {
      return res.status(200).json({ success: false, data: 0, message: "Slot already booked" });
    }

    // Calculate available slots (assuming 1 slot per time for now)
    const availableSlots = salon.maxBookingPerSlot ? salon.maxBookingPerSlot - 1 : 1;

    return res.status(200).json({ success: true, data: availableSlots });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Create booking
router.post("/create", middleware, async (req, res) => {
  try {
    const { salon, appointmentDate, startTime, endTime, notes } = req.body;
    if (!salon || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const salonDoc = await SalonModel.findById(salon);
    if (!salonDoc) {
      return res.status(404).json({ success: false, message: "Salon not found" });
    }

    // Basic overlap check for same salon and date
    const overlapping = await BookingModel.findOne({
      salon,
      appointmentDate,
      startTime,
      endTime,
    });
    if (overlapping) {
      return res.status(409).json({ success: false, message: "Slot already booked" });
    }

    const booking = await BookingModel.create({
      user: req.userId,
      salon,
      appointmentDate,
      startTime,
      endTime,
      notes,
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// User bookings
router.get("/mine", middleware, async (req, res) => {
  try {
    const bookings = await BookingModel.find({ user: req.userId })
      .populate("salon")
      .sort({ appointmentDate: 1, startTime: 1 });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Owner bookings across their salons
router.get("/owner", middleware, async (req, res) => {
  try {
    const ownerSalons = await SalonModel.find({ owner: req.userId }).select("_id");
    const salonIds = ownerSalons.map((s) => s._id);
    const bookings = await BookingModel.find({ salon: { $in: salonIds } })
      .populate("user", "name email")
      .populate("salon", "name city state")
      .sort({ appointmentDate: 1, startTime: 1 });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status (owner)
router.put("/:id/status", middleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const booking = await BookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const salon = await SalonModel.findOne({ _id: booking.salon, owner: req.userId });
    if (!salon) {
      return res.status(403).json({ success: false, message: "Not authorized for this booking" });
    }

    booking.status = status;
    await booking.save();
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
