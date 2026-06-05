import type { ReactNode } from "react";
import { motion } from "framer-motion";

export const StatCard = ({ label, value, icon, accent = "text-oranje-300" }: { label: string; value: string | number; icon?: ReactNode; accent?: string }) => (
  <motion.div whileHover={{ y: -3 }} className="glass card-hover overflow-hidden p-5">
    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ${accent}`}>{icon}</div>
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="mt-1 text-sm font-semibold text-slate-300">{label}</p>
  </motion.div>
);
