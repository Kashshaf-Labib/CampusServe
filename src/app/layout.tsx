import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ChatbotProvider from "@/components/ChatbotProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <ChatbotProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ChatbotProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
