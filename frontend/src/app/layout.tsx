import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agro App Organization",
  description: "building a better future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: "#BEE6Ce",
              color: "#8DFFCD",
              borderColor: "rgba(255,255,255, 0.5)"
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
