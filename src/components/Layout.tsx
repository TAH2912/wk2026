import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigation } from "./Navigation";

export const Layout = ({ children, toast }: { children: ReactNode; toast?: string }) => (
  <div className="min-h-full bg-grid-stadion">
    <Navigation />
    <main className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:ml-72 lg:px-8 lg:pb-10">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-oranje-300/30 bg-stadion-850 px-5 py-3 text-sm font-bold text-white shadow-glow lg:bottom-8"
        >
          {toast}
        </motion.div>
      ) : null}
    </AnimatePresence>
  </div>
);
