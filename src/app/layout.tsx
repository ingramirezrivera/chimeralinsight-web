import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Importamos el Navbar aquí

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Chimeralinsight",
  description: "Website for the Author Chimeralinsight",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoCondensed.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
