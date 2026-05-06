"use client"
import { useState, useEffect, useRef } from "react"

export const TruncateText = ({ text }: { text: string }) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Check if the text exceeds 2 lines (adjust based on your design)
        const isOverflowing = textRef.current.scrollHeight > 40
        setIsTruncated(isOverflowing)
      }
    }

    checkTruncation()
    window.addEventListener("resize", checkTruncation) // Recheck on window resize
    return () => {
      window.removeEventListener("resize", checkTruncation)
    }
  }, [])

  return (
    <div className="pr-2 overflow-hidden">
      <p
        ref={textRef}
        className={`text-xs text-sub-500 ${isTruncated && "line-clamp-2"}`}
      >
        {text}
      </p>
    </div>
  )
}
