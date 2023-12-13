import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "react-toggle/style.css";
import "./globals.scss";

const poppins = Poppins({
  weight: ["300", "400"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Space",
  description: "Environment to focus on studying while listening to music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
