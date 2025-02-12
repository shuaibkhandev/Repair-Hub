const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/repair_hub");
    console.log("DB Connected Successfully! 😍");
  } catch (err) {
    console.error("DB Connection Failed! 😑", err);
    process.exit(1);
  }
};

module.exports = connectDB;
