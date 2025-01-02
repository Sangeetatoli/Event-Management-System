const express = require("express");
const {
  getMemberProfile,
  updateMemberProfile,
  registerForEvent,
  getRegisteredEvents
} = require("../controllers/memberController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Member profile routes
router.get("/profile", getMemberProfile);
router.put("/profile", updateMemberProfile);

// Event registration routes
router.post("/events/register", registerForEvent);
router.get("/events/registered", getRegisteredEvents);

module.exports = router;