import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";
import BouncingDVDLogo from "./components/DvD";

const inter = Inter({ subsets: ["latin"] });
const fontVt323 = VT323({
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Zen Click",
  description: "One click away from zen",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontVt323.className}>
        <BouncingDVDLogo />
        {children}</body>
    </html>
  );
}
