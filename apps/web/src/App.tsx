import { Outlet } from "react-router"
import { Navbar } from "@/components/layout/Navbar.tsx"
import { Footer } from "@/components/layout/Footer.tsx"

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}




