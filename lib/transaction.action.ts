"use server";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "./prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { absoluteUrl } from "./utils";

const settingsUrl = absoluteUrl("/pricing");

export async function checkoutCredits(transaction: any) {
  const currentUser = await getCurrentUser();
  const amount = Number(transaction.amount) * 100;

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: currentUser.id,
    },
  });

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: settingsUrl,
    });

    redirect(stripeSession.url!);
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: settingsUrl,
    cancel_url: settingsUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: currentUser.email?.toString(),
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: transaction.plan,
            description: "AI Generations",
          },
          unit_amount: amount,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: currentUser.id,
      plan: transaction.plan,
      amount: transaction.amount,
    },
  });

  redirect(stripeSession.url!);
}
