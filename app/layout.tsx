import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/navbar/header";
import { Inter } from "next/font/google";
import Footer from "@/components/navbar/footer";
import { ModalProvider } from "@/components/modal-provider";
import getCurrentUser from "./actions/getCurrentUser";
import { ToasterProvider } from "@/components/toaster-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Only the best AI images",
  description: "get amazing AI images",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider />
        <ToasterProvider />
        <Header currentUser={currentUser} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
