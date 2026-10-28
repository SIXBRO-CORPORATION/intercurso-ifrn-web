import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/contexts/auth-context";
import { QueryProvider } from "@/lib/query-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intercurso IFRN",
  description: "Acompanhe jogos, tabelas e resultados do Intercurso do IFRN.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="pt-BR"
          className={`${poppins.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col"><QueryProvider><AuthProvider>{children}</AuthProvider></QueryProvider></body>
      </html>
  );
}