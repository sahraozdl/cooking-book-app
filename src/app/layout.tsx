import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Cooking Book App",
  description: "A cooking book app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
