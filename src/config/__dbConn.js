const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://welivesoft:nbJYMuuoiubXWYXk@repair-hub-cluster.d8okrmx.mongodb.net/repair-hub?retryWrites=true&w=majority&appName=Repair-Hub-cluster");
    console.log("DB Connected Successfully! 😍");
  } catch (err) {
    console.error("DB Connection Failed! 😑", err);
    process.exit(1);
  }
};

module.exports = connectDB;
