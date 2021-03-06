let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
var models = require("./../models");
var Pouch = mongoose.model("Pouch");
var User = mongoose.model("User");

router.get("/:userId", async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId).populate("pouches");
    let pouches = user.pouches;
    if (!pouches) {
      res.send(404);
    }
    console.log(pouches);
    res.json(pouches);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let { name, ownerId } = req.body;
    let pouch = await new Pouch({
      ownerId: ownerId,
      name: name,
      itemIds: []
    });

    pouch = await pouch.save();
    if (!pouch) {
      res.send(500);
    }
    let user = await User.findById(ownerId);
    user.pouches.push(pouch._id);
    await user.save();
    res.json(pouch);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    let pouch = await Pouch.findById(req.params.id);
    pouch.name = req.body.name;
    pouch = await pouch.save();
    console.log(pouch);
    res.json(pouch);
  } catch (e) {
    res.status(500);
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let pouch = await Pouch.findByIdAndRemove(req.params.id);
    if (!pouch) {
      res.send(500);
    }
    res.json(pouch);
  } catch (e) {
    res.status(500);
    next(e);
  }
});

module.exports = router;
