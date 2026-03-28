import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function TrendCard({ trend, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="rounded-[28px] bg-white/90 p-5 shadow-[0_18px_50px_rgba(122,58,44,0.12)] backdrop-blur"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-runway-100 px-3 py-1 text-sm font-semibold text-runway-700">
            <Sparkles className="h-4 w-4" />
            {trend.category}
          </p>
          <h3 className="text-xl font-bold tracking-tight text-ink-900">{trend.name}</h3>
        </div>
        <span className="rounded-full bg-blush-100 px-3 py-1 text-sm font-semibold text-blush-700">
          {trend.momentum}
        </span>
      </div>
      <p className="text-base leading-relaxed text-ink-600">{trend.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {trend.keyPieces.map((piece) => (
          <span key={piece} className="rounded-full bg-sand-100 px-3 py-2 text-sm font-medium text-ink-700">
            {piece}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-sand-200 pt-4 text-sm text-ink-500">
        <span>{trend.source}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-runway-700">
          Watch now
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.article>
  );
}
