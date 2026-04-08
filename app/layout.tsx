import Navbar from "@/components/Navbar"
import "./globals.css"
import Footer from "@/components/Footer"

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
          {children}
        </div>

        <Footer/>

      </body>
    </html>
  )
}