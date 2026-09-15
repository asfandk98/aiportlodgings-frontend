import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AirportHotelDubai.com — Instant Airport Hotel Booking",
  description:
    "Book hotels near DXB and DWC in under 2 minutes. Free shuttle included.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-surface text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}