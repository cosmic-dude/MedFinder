const express = require("express");
const Medicine = require("../models/Medicine");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(200).json([]);
    }

    const medicines = await Medicine.find({
      medicineName: { $regex: q, $options: "i" },
      inStock: { $gt: 0 },
    })
      .populate("pharmacyId", "shopName address city phone")
      .sort({ inStock: -1, price: 1 });

    return res.status(200).json(medicines);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
