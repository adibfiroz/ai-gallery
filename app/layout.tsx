import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/navbar/header";
import { Inter } from "next/font/google";
import Footer from "@/components/navbar/footer";
import { ModalProvider } from "@/components/modal-provider";
import { getCurrentUser } from "./actions/getCurrentUser";
import { ToasterProvider } from "@/components/toaster-provider";
import { dailyLimit } from "./actions/user";
import Providers from "@/components/providers";
import LoadingBar from "@/components/loadingBar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "The Best of AI images",
  description: "Browse thousands of AI images",
};

export default async function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()

  await dailyLimit()

  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingBar />
        <Providers>
          <ModalProvider />
          <ToasterProvider />
          <Header currentUser={currentUser} />
          {modal}
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
