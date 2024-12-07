import mongoose from "mongoose";

// Define subscription schema
const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["basic", "premium", "institutional"],
      default: "basic",
    },
    startDate: { type: Date, default: Date.now }, // Subscription start date
    endDate: {
      type: Date,
      required: function () {
        return this.type !== "basic";
      },
    }, // Only required if the type is not 'free'
    isActive: { type: Boolean, default: true },
    history: [
      {
        type: {
          type: String,
          enum: ["basic", "premium", "institutional"],
          required: true,
        },
        startDate: { type: Date, required: true },
        endDate: {
          type: Date,
          required: function () {
            return this.type !== "basic";
          },
        },
        renewedAt: { type: Date, default: null },
        status: {
          type: String,
          enum: ["active", "expired", "renewed", "replaced", "cancelled"],
          default: "active",
        },
      },
    ],
  },
  { timestamps: true }
);

// Add indexing for performance optimization
subscriptionSchema.index({ userId: 1, isActive: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema,
  "subscriptionData"
);
export default Subscription;
