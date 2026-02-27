import { AnimatePresence, motion as Motion } from 'framer-motion'

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false, onConfirm, onCancel, isLoading = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#050B18]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="mt-3 text-sm text-slate-300">{message}</p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                    isDangerous
                      ? 'border border-rose-500/50 bg-rose-500/15 hover:bg-rose-500/25'
                      : 'border border-cyan-400/50 bg-cyan-500/15 hover:bg-cyan-500/25'
                  }`}
                >
                  {isLoading ? 'Processing...' : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
