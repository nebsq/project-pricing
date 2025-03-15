import { Button } from "@/components/ui/button"
import { HoldButton } from "@/components/ui/hold-button"
import { useNavigate } from "react-router-dom"
import inploiLogo from "@/assets/inploi-full-logo-primary (1).png"

interface DashboardNavProps {
  onSignOut: () => Promise<void>
}

export function DashboardNav({ onSignOut }: DashboardNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <img src={inploiLogo} alt="inploi logo" className="h-8" />
          </a>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <HoldButton />
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}