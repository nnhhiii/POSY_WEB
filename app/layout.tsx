import Navbar from "@/components/Navbar"
import "./globals.css"
import Footer from "@/components/Footer"
import { SnackbarProvider } from "@/components/SnackbarContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>

        <Navbar />

        <div className="mt-16 max-w-7xl px-4 mx-auto">
          <SnackbarProvider>{children}</SnackbarProvider>
        </div>

        <Footer/>

      </body>
    </html>
  )
}