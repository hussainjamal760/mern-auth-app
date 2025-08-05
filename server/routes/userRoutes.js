const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const getUserData = require("../controllers/userController");

router.get("/data", userAuth, getUserData);

module.exports = router;
