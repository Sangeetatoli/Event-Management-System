const Member = require("../models/Member");
const Event = require("../models/Event");

const getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.user.id).select("-password");
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch profile", 
      error: error.message 
    });
  }
};

const updateMemberProfile = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.user.id, 
      req.body, 
      { new: true }
    ).select("-password");
    
    if (!updatedMember) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedMember
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile", 
      error: error.message 
    });
  }
};

const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: "Event not found" 
      });
    }

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    if (member.registeredEvents.includes(eventId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Already registered for this event" 
      });
    }

    member.registeredEvents.push(eventId);
    await member.save();

    res.status(200).json({ 
      success: true, 
      message: "Successfully registered for the event" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to register for event", 
      error: error.message 
    });
  }
};

const getRegisteredEvents = async (req, res) => {
  try {
    const member = await Member.findById(req.user.id)
      .populate("registeredEvents");
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: member.registeredEvents 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch registered events",
      error: error.message
    });
  }
};

module.exports = {
  getMemberProfile,
  updateMemberProfile,
  registerForEvent,
  getRegisteredEvents
};