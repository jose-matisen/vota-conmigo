import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vota conmigo",
  description: "Vota conmigo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased animated-gradient min-h-svh `}
      >
        <NextUIProvider>
        <div className="relative z-10 ">{children}</div>
        </NextUIProvider>
        <Toaster />
      </body>
    </html>
  );
}
