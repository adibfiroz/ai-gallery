import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { MAX_FREE_CAPTION_LIMIT, MAX_PRO_CAPTION_LIMIT } from "@/constants";
import Replicate from "replicate";
import {
  getFreeCaptionCount,
  getProCaptionCount,
  increaseFreeCaptionCount,
  increaseProCaptionCount,
} from "@/lib/api-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { image } = body;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!replicate.auth) {
      return new NextResponse("Replicate API Key not configured.", {
        status: 501,
      });
    }

    if (!image) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const isSubscribed = await checkSubscription();
    const apiCaptionCount = await getFreeCaptionCount();
    const apiSubscriberCreditCount = await getProCaptionCount();

    const credit = 1;

    if (!isSubscribed) {
      if (apiCaptionCount + credit > MAX_FREE_CAPTION_LIMIT) {
        return NextResponse.json(
          { message: "You have exhausted your daily credits" },
          { status: 403 }
        );
      }
    }

    if (isSubscribed) {
      if (apiSubscriberCreditCount + credit > MAX_PRO_CAPTION_LIMIT) {
        return NextResponse.json(
          {
            message:
              "You have exausted your credits, wait until they resets on your billing date!",
          },
          { status: 401 }
        );
      }
    }

    const response = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          task: "image_captioning",
          image: image,
        },
      }
    );

    if (response) {
      if (!isSubscribed) {
        await increaseFreeCaptionCount(credit);
      } else {
        await increaseProCaptionCount(credit);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
