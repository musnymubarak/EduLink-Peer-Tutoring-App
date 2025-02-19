const calendar = require("../config/googleConfig");

const generateMeetLink = async (req, res) => {
  try {
    const { title, description, start, end } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = {
      summary: title,
      description,
      start: { dateTime: start, timeZone: "Asia/Colombo" },
      end: { dateTime: end, timeZone: "Asia/Colombo" },
      conferenceData: { createRequest: { requestId: String(Date.now()) } },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    return res.status(200).json({ meetLink: response.data.hangoutLink });
  } catch (error) {
    console.error("Error creating Meet link:", error);
    return res.status(500).json({ error: "Failed to generate Meet link" });
  }
};

module.exports = { generateMeetLink };
