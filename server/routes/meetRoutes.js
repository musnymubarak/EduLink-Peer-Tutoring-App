const express = require("express");
const { generateMeetLink } = require("../controllers/meetController");
const {authenticateGoogle} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate-meet-link", authenticateGoogle, generateMeetLink);

module.exports = router;
