const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");


dotenv.config();


const userRoutes = require("./routes/authRoute");

const database = require("./config/db");

const app = express();

const PORT = process.env.PORT || 4000;


database.connect();


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

app.use("/api/v1/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
