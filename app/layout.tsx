import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import JsonLd from "@/components/JsonLd";
import { legalServiceSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"], weight: ["400", "500", "600"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600"], display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Pereira e Monteiro | Advocacia Criminal",
    template: "%s",
  },
  description: "Pereira e Monteiro Advogados: atuação estratégica em Direito Criminal, com atendimento sigiloso em São Paulo – SP.",
  keywords: ["Pereira e Monteiro Advogados", "advocacia criminal", "advogado criminalista", "direito criminal", "habeas corpus", "audiência de custódia", "tribunal do júri"],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <JsonLd data={legalServiceSchema()} />
        <Header />
        <main className="pt-20 md:pt-24">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
