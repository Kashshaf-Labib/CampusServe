import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ChatbotProvider from "@/components/ChatbotProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <Navbar />
          <ChatbotProvider>{children}</ChatbotProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
