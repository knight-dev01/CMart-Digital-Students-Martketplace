import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ThemeProvider } from "@/components/ThemeContext";
import { AuthProvider } from "@/components/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { CartProvider } from "@/components/CartContext";
import PWARegistration from "@/components/PWARegistration";
import { PageTransitionOverlay } from "@/components/PageTransitionOverlay";
import { LoadingProvider } from "@/components/LoadingContext";
import { NotificationProvider } from "@/components/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata = {
  title: "CMart | Digital Student Marketplace",
  description: "Independent student shops and campus vendors in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CMart" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <PWARegistration />
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              <NotificationProvider>
                <AuthGuard>
                  <CartProvider>
                    <PageTransitionOverlay />
                    <Navbar />
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                    <MobileBottomNav />
                  </CartProvider>
                </AuthGuard>
              </NotificationProvider>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}




