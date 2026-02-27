import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -7, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      className={`rounded-glass border border-white/15 bg-white/8 shadow-glass backdrop-blur-ultra ${className}`}
    >
      {children}
    </motion.div>
  )
}

