import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asteroid Tracker",
  description: "Asteroid Tracker",
  icons: {
    icon: "/asteroid-fav.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider>
        {/* This is the main layout for the app */}
        <Header />
        <div className="transparent-background">
          {children}
          <img
            className="asteroid-float animate-spin slow-spin w-[2000px] left-[2%] top-[15%] 
              sm:w-[2000px] sm:left-[2%] sm:top-[10%]        
              md:w-[100%] md:left-[2%] md:top-[10%] 
              lg:w-[80%] lg:left-[10%] lg:top-[12%] 
              xl:w-[65%] xl:left-[17%] xl:top-[10%]"
            src="/img/asteroid.png"
            alt="Asteroid"
          />
        </div>
      </ThemeProvider>
      </body>
    </html>
  );
}