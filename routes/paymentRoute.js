import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import express from "express";
import crypto from "crypto"; // Import crypto using ES6 syntax
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

/* eslint-disable no-undef */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
/* eslint-enable no-undef */

router.post("/order", (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpay.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
      console.log(order);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/capture-payment", async (req, res) => {
  const { paymentId, amount } = req.body;
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.status === "authorized") {
      const response = await razorpay.payments.capture(paymentId, amount * 100);
      res.json(response);
    } else {
      res.status(400).json({ message: "Payment not authorized for capture" });
    }
  } catch (error) {
    console.error("Payment capture error:", error);
    res.status(500).json({ message: "Payment capture failed", error });
  }
});

router.post("/verify-payment", (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  // Construct the expected signature
  const hmac = crypto.createHmac("sha256", razorpay.key_secret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === signature) {
    res.json({ success: true });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});

router.get("/payment-status/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment status", error });
  }
});
router.post("/webhook", express.json(), (req, res) => {
  const secret = "your_webhook_secret"; // Set this in Razorpay dashboard and keep it private

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const generatedSignature = shasum.digest("hex");

  if (generatedSignature === req.headers["x-razorpay-signature"]) {
    // Webhook verified, handle the event
    const event = req.body.event;
    if (event === "payment.captured") {
      // Payment captured, update order status in the database
    } else if (event === "payment.failed") {
      // Handle failed payment
    }
    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
});

export default router;
