const express = require("express");
const Pharmacy = require("../models/Pharmacy");
const { protect, pharmacyOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", protect, pharmacyOnly, async (req, res) => {
  try {
    const { shopName, address, city, phone, latitude, longitude } = req.body;

    if (!shopName || !address || !city || !phone) {
      return res.status(400).json({ message: "All profile fields are required" });
    }

    const profilePayload = {
      userId: req.user._id,
      shopName,
      address,
      city,
      phone,
    };

    if (latitude !== undefined && longitude !== undefined) {
      const lat = Number(latitude);
      const lng = Number(longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return res.status(400).json({ message: "Latitude and longitude must be valid numbers" });
      }

      profilePayload.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { userId: req.user._id },
      profilePayload,
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json(pharmacy);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

router.get("/profile", protect, pharmacyOnly, async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ userId: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy profile not found" });
    }

    return res.status(200).json(pharmacy);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
