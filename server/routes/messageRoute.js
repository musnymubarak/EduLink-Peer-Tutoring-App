const express = require("express");
const router = express.Router();
const { createCommunityMessage, getCommunityMessagesByCourse } = require("../controllers/messageController");

router.post("/", createCommunityMessage);

router.get("/:courseId/:userId", getCommunityMessagesByCourse);

module.exports = router;
