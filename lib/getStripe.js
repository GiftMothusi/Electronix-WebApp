import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  //If the stripe promise doesnt exist then set it accordingly
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

export default getStripe;
