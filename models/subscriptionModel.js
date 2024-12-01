import mongoose from "mongoose";

// Define the subscription plan schema
const subscriptionPlanSchema = new mongoose.Schema(
  {
    subscriptionType: {
      type: String,
      enum: ["basic", "premium", "institutional"],
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model for subscription plan
const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;
