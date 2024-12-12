const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    const dbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/studynotionDB";

    mongoose
        .connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("DB Connected Successfully"))
        .catch((error) => {
            console.log("DB Connection Failed");
            console.error(error);
            process.exit(1); 
        });
};
