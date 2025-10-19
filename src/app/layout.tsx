import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local"
import "./globals.css";


const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["100","200","300","400", "500", "600", "700","800","900"]});

export const metadata: Metadata = {
  title: "Judix - Design System",
  description: "A design system for JudiX",
};

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${satoshi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
