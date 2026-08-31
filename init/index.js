const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); 
const initData = require("./data.js");
const { object } = require("joi");

const MONG_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONG_URL);
  console.log("Database connection successful");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "65f0b8c9d4e5a7b8c9d4e5a7"}));  
    await Listing.insertMany(initData.data);
    console.log("Data was successfully initialized and saved.");
  } catch (err) {
    console.error("Error during initialization:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed after seeding.");
  }
};

main()
  .then(initDB)
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
