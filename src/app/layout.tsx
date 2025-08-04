import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserProvider } from "@/components/UserContext";

export const metadata: Metadata = {
  title: "Cooking Book App",
  description: "A cooking book app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <UserProvider>
          <Navbar />

          {children}

          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
