export const stripe = require("stripe")(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-10-28.acacia",
});
