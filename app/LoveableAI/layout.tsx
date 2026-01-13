import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({ 
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boekenkast",
  description: "Je persoonlijke digitale boekenkast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
        <Providers>{children}</Providers>
     
  );
}
