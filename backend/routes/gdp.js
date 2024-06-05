const express = require("express");
const router = express.Router();
const GDP = require("../models/Gdp.js");
const fs = require("fs");

const defaultData = JSON.parse(fs.readFileSync("ThailandGDP.json", "utf8"));

router.get("/", async (req, res, next) => {
  try {
    const data = await GDP.find();
    if (data.length === 0) {
      console.log("No data found in the database. Importing default data.");
      console.log(defaultData);
      await GDP.insertMany(defaultData);
      console.log("Default data imported to the database.");
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { Province_ENG, GDP2020 } = req.body;

    // Check if Province_ENG is null or duplicate
    if (!Province_ENG) {
      return res.status(400).json({ status: 400, error: "Province_ENG is required" });
    }

    const existingProvince = await GDP.findOne({ Province_ENG });
    if (existingProvince) {
      return res.status(400).json({ status: 400, error: "Province_ENG already exists" });
    }

    // Check if GDP2020 is null
    if (!GDP2020) {
      return res.status(400).json({ status: 400, error: "GDP2020 is required" });
    }

    const data = await GDP.create(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.delete("/:Province_ENG", async (req, res, next) => {
  try {
    const { Province_ENG } = req.params;

    // Validate Province_ENG
    if (!Province_ENG) {
      return res.status(400).json({ error: "Province_ENG is required" });
    }

    const data = await GDP.findOneAndDelete({ Province_ENG });
    if (!data) {
      return res.status(404).json({ error: "Province not found" });
    }

    res.json({ message: "Province deleted successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await GDP.findById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await GDP.findByIdAndUpdate(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
