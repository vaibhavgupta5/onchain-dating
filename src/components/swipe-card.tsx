"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import type { UserProfile } from "@/lib/types";

interface SwipeCardProps {
  profile: UserProfile;
  onLike: () => void;
  onPass: () => void;
  isLoading?: boolean;
}

export function SwipeCard({ profile, onLike, onPass, isLoading }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const threshold = 100;
    if (info.offset.x > threshold || info.velocity.x > 500) {
      onLike();
    } else if (info.offset.x < -threshold || info.velocity.x < -500) {
      onPass();
    }
  }

  return (
    <motion.div
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ 
        x: x.get() > 0 ? 400 : -400, 
        opacity: 0, 
        rotate: x.get() > 0 ? 45 : -45,
        transition: { duration: 0.4 } 
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="relative rounded-sm overflow-hidden paper-card border-2 border-wood-brown/30 shadow-2xl rough-edge" style={{ aspectRatio: "3/4" }}>
        {/* Profile image with paper texture overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center grayscale-[0.2] sepia-[0.2]"
          style={{ backgroundImage: `url(${profile.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-paper-light opacity-10 pointer-events-none" />

        {/* Ink-wash overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-paper-dark via-paper-dark/20 to-transparent" />

        {/* Stamp indicators */}
        <motion.div
          className="absolute top-8 right-8 px-4 py-2 border-4 border-accent-forest text-accent-forest font-black text-3xl uppercase tracking-tighter stamp z-20"
          style={{ opacity: likeOpacity }}
        >
          Approved
        </motion.div>

        <motion.div
          className="absolute top-8 left-8 px-4 py-2 border-4 border-wood-brown text-wood-brown font-black text-3xl uppercase tracking-tighter stamp z-20"
          style={{ opacity: passOpacity }}
        >
          Declined
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-linear-to-t from-paper-light to-transparent">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-4xl font-black text-wood-dark serif">{profile.name}</h2>
            <span className="text-xl text-ink-grey serif italic">{profile.age}</span>
          </div>

          <p className="text-sm text-ink-black/80 mb-4 line-clamp-2 leading-relaxed serif font-medium">{profile.bio}</p>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-paper-dark/50 text-wood-brown border border-wood-brown/20 text-[10px] font-bold uppercase tracking-widest"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Registry Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-paper-light/80 border border-wood-brown/20 shadow-sm text-[10px] font-bold text-ink-grey uppercase tracking-tighter italic">
            Registry Verified
          </div>
        </div>
      </div>

      {/* Action buttons - Traditional look */}
      <div className="flex justify-center gap-8 mt-10">
        <button
          onClick={onPass}
          disabled={isLoading}
          className="w-16 h-16 rounded-full paper-card border-2 border-wood-brown/40 flex items-center justify-center text-wood-brown hover:bg-paper-dark hover:scale-110 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          onClick={onLike}
          disabled={isLoading}
          className="w-20 h-20 rounded-full bg-wood-brown flex items-center justify-center text-paper-light hover:bg-wood-dark hover:scale-110 active:scale-95 transition-all disabled:opacity-50 shadow-[0_10px_20px_rgba(93,64,55,0.3)]"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button
          disabled={isLoading}
          className="w-16 h-16 rounded-full paper-card border-2 border-accent-amber/40 flex items-center justify-center text-accent-amber hover:bg-paper-dark hover:scale-110 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export function EmptySwipeState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-12 paper-card rough-edge border-2 border-dashed border-wood-brown/20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-24 h-24 rounded-full bg-paper-dark flex items-center justify-center mb-8 border border-wood-brown/10 animate-float shadow-inner">
        <svg className="w-12 h-12 text-wood-brown opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-wood-dark mb-4 serif">Archive Exhausted</h3>
      <p className="text-ink-grey italic leading-relaxed serif font-medium max-w-xs">
        "You have reviewed every candidate in the ledger. Patience is a virtue, check back as new entries are scribed."
      </p>
      <div className="mt-8 px-6 py-2 border border-wood-brown text-[10px] font-bold text-wood-brown uppercase tracking-widest stamp opacity-50">End of Volume</div>
    </motion.div>
  );
}
