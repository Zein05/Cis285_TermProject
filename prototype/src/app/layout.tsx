import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SplitSmart — shared expenses, made simple",
  description: "A friendly way to keep shared expenses and group balances in sync.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
