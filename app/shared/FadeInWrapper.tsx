"use client"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

export default function FadeInWrapper({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
