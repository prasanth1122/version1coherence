import dotenv from "dotenv";
import mongoose from "mongoose";
import SubscriptionPlan from "../backend/models/subscriptionDataSchema.js"; // Adjust path as needed

dotenv.config(); // Load environment variables from .env

const defaultSubscriptions = [
  { subscriptionType: "basic", durationMonths: 1, price: 100 },
  { subscriptionType: "premium", durationMonths: 3, price: 250 },
  { subscriptionType: "institutional", durationMonths: 3, price: 500 },
];

async function prepopulateSubscriptions() {
  try {
    console.log(process.env.MONGO_URI); // Check if URI is being loaded correctly

    await mongoose.connect(process.env.MONGO_URI); // MongoDB URI from .env

    // Check if any subscription plans already exist
    const existingSubscriptions = await SubscriptionPlan.find();

    if (existingSubscriptions.length === 0) {
      // If no subscription plans exist, add the default ones
      await SubscriptionPlan.insertMany(defaultSubscriptions);
      console.log("Default subscription plans added successfully.");
    } else {
      console.log("Subscription plans already exist.");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error while prepopulating subscription data:", error);
    mongoose.connection.close();
  }
}

prepopulateSubscriptions();
