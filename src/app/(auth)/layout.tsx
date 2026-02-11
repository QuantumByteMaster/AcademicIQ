import { Header } from "@/components/Header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8F6F0] w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      {children}
    </div>
  )
} 