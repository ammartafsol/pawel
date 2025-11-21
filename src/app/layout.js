import { CustomProvider } from "@/store/customProvider";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "next-web",
  description: `A Next.js web application with custom fonts and styles`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`} suppressHydrationWarning>
        <ToastContainer />
        <CustomProvider>
          {/* <SocketProvider> */}
          {children}
          {/* </SocketProvider> */}
        </CustomProvider>
      </body>
    </html>
  );
}
