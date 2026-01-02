import "./globals.css";
import React from "react";
import Providers from "./providers";
import { ModalProvider } from "@/Components/modals/ModalProvider";
import RootModal from "@/Components/modals/RootModal";

export const metadata = {
  title: "GTSNext",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ModalProvider>
            <RootModal/>
            {children}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
