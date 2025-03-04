import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }
    const freeDownload = await prismadb.userDownloadLimit.findUnique({
      where: {
        userId: currentUser.id,
      },
    });

    if (!freeDownload) {
      return 0;
    }

    return NextResponse.json(freeDownload);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
