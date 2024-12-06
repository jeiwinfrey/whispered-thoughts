import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { MainNav } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whispered Thoughts - Share Your Story",
  description: "A safe space to express your feelings and connect with others who understand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <MainNav />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}