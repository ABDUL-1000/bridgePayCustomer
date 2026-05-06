import { AnimatePresence, motion } from "framer-motion"

interface AnimateDetailProps {
  canView: boolean
  hiddenContent: React.ReactNode
  visibleContent: React.ReactNode
}

const AnimateDetail: React.FC<AnimateDetailProps> = ({
  canView,
  hiddenContent,
  visibleContent,
}) => (
  <AnimatePresence mode="wait">
    {!canView && (
      <motion.div
        key="hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.6 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {hiddenContent}
      </motion.div>
    )}
    {canView && (
      <motion.div
        key="visible"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {visibleContent}
      </motion.div>
    )}
  </AnimatePresence>
)

export default AnimateDetail
