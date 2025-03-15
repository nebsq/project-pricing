import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function HoldButton() {
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const triggerPricingUpdate = async () => {
    try {
      const response = await fetch(
        "https://hook.eu1.make.com/3kg5xrw94ijqdqgenphdqduxvf7r74dr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) throw new Error("Failed to trigger pricing update")
      toast.success("Pricing update triggered successfully")
    } catch (error) {
      console.error("Error triggering pricing update:", error)
      toast.error("Failed to trigger pricing update")
    }
  }

  const startHolding = () => {
    if (isDisabled) return

    setIsHolding(true)
    setProgress(0)

    holdTimerRef.current = setTimeout(async () => {
      await triggerPricingUpdate()
      resetButton()
      setIsDisabled(true)
      setTimeout(() => setIsDisabled(false), 60000) // 1-minute cooldown
    }, 3000) // 3 second hold time

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / 30), 100))
    }, 100)
  }

  const resetButton = () => {
    setIsHolding(false)
    setProgress(0)
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "relative min-w-[180px] transition-all duration-200",
          isHolding && "bg-accent"
        )}
        onMouseDown={startHolding}
        onMouseUp={resetButton}
        onMouseLeave={resetButton}
        onTouchStart={startHolding}
        onTouchEnd={resetButton}
        disabled={isDisabled}
      >
        {isDisabled
          ? "Please wait 1 minute"
          : isHolding
          ? "Hold to confirm..."
          : "Get latest pricing"}
      </Button>
      {isHolding && (
        <div className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}