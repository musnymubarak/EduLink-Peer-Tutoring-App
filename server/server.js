const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const path = require("path");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/authRoute");
const courseRoutes = require("./routes/courseRoute");
const sectionRoutes = require("./routes/sectionRoute");
const enrollmentRoutes = require("./routes/enrollmentRoute");
const tutorRoutes = require("./routes/tutorRoute");
const profileRoutes = require("./routes/profileRoute");
const messageRoutes = require("./routes/messageRoute");
const ratingRoutes = require("./routes/ratingRoute");
const classRoutes = require("./routes/classRoute"); 
const notificationRoute = require("./routes/notificationRoute");
const meetRoutes = require("./routes/meetRoutes");
const reportRoute = require("./routes/reportRoute")

// Import database configuration
const database = require("./config/db");

// Initialize Express app
const app = express();

// Define the port
const PORT = process.env.PORT || 5000;

// Connect to the database
database.connect();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// File uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define routes

// Public routes
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/sections", sectionRoutes);

// Protected routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/enrollment", enrollmentRoutes);
app.use("/api/v1/tutor", tutorRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/classes", classRoutes);  
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/meet", meetRoutes);
app.use("/api/v1/report", reportRoute);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
