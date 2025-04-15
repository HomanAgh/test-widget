import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans, Montserrat } from "next/font/google";
import { Providers } from "./providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  // Add Montserrat
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={`ep-widget-container ${openSans.variable} ${montserrat.variable}`}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
