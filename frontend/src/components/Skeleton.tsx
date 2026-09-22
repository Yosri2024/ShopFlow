"use client";
import { motion } from "framer-motion";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 animate-pulse">
      <div className="aspect-square bg-zinc-100 rounded-xl" />
      <div className="h-4 bg-zinc-100 rounded w-3/4" />
      <div className="h-3 bg-zinc-100 rounded w-1/2" />
      <div className="h-6 bg-zinc-100 rounded w-1/3" />
    </div>
  );
}

export function PageSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="h-8 bg-zinc-100 rounded w-40 mb-6 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <ProductSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      {children}
    </motion.div>
  );
}
