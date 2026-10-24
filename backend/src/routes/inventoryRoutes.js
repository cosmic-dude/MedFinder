const express = require("express");
const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");
const { protect, pharmacyOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const getPharmacyByUserId = async (userId) => {
  return Pharmacy.findOne({ userId });
};

router.post("/", protect, pharmacyOnly, async (req, res) => {
  try {
    const { medicineName, brand, price, inStock } = req.body;

    if (!medicineName || price === undefined) {
      return res.status(400).json({ message: "Medicine name and price are required" });
    }

    const pharmacy = await getPharmacyByUserId(req.user._id);
    if (!pharmacy) {
      return res.status(400).json({ message: "Create pharmacy profile first" });
    }

    const medicine = await Medicine.create({
      pharmacyId: pharmacy._id,
      medicineName,
      brand,
      price,
      inStock: inStock ?? 0,
    });

    return res.status(201).json(medicine);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", protect, pharmacyOnly, async (req, res) => {
  try {
    const pharmacy = await getPharmacyByUserId(req.user._id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy profile not found" });
    }

    const medicines = await Medicine.find({ pharmacyId: pharmacy._id }).sort({ createdAt: -1 });
    return res.status(200).json(medicines);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, pharmacyOnly, async (req, res) => {
  try {
    const pharmacy = await getPharmacyByUserId(req.user._id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy profile not found" });
    }

    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, pharmacyId: pharmacy._id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.status(200).json(medicine);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, pharmacyOnly, async (req, res) => {
  try {
    const pharmacy = await getPharmacyByUserId(req.user._id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy profile not found" });
    }

    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      pharmacyId: pharmacy._id,
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.status(200).json({ message: "Medicine removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
