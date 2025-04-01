"use client";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/tailwind.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { usePathname } from "next/navigation";
import CarritoProviderWrapper from '../components/Providers/CarritoProviderWrapper';
import FloatingCartButton from "@/components/FloatingCartButton/FloatingCartButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Rutas donde se ocultan los elementos
  const hideHeaderOn = ["/carrito", "/login", "/register", "/dashboard", "/checkout"]; 
  const shouldHideHeader = hideHeaderOn.includes(pathname);

  const hideFooterOn = ["/carrito", "/login", "/register", "/dashboard", "/checkout"]; 
  const shouldHideFooter = hideFooterOn.includes(pathname);
  
  // Rutas donde NO se muestra el botón flotante del carrito
  const hideCartButtonOn = ["/carrito", "/checkout", "/dashboard"]; // Añade aquí las rutas donde NO quieras que aparezca
  const shouldShowCartButton = !hideCartButtonOn.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CarritoProviderWrapper>
          {/* Muestra el Header solo si NO es /carrito */}
          {!shouldHideHeader && <Header />}

          <main>{children}</main>

          {!shouldHideFooter && <Footer />}
          <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/67ec6744749e18190dd3ac95/1inpn6pjd';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                setTimeout(() => {
        var chatWidget = document.querySelector('#tawkchat-container');
        if (chatWidget) {
          chatWidget.style.zIndex = '10';
        }
      }, 3000);
              })();
            `,
          }}
        />
          {/* Botón flotante del carrito - visible en todas las rutas excepto las especificadas */}
          {shouldShowCartButton && <FloatingCartButton />}
          
        </CarritoProviderWrapper>
       
      </body>
    </html>
  );
}
