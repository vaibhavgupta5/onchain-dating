"use client";

import { motion } from "framer-motion";
import type { Match } from "@/lib/types";
import Link from "next/link";

interface MatchCardProps {
  match: Match;
  index: number;
}

export function MatchCard({ match, index }: MatchCardProps) {
  const profile = match.profile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
    >
      <Link href={`/chat?match=${match.id}`}>
        <div className="paper-card overflow-hidden card-glow border-wood-brown/20 hover:border-wood-brown/40 transition-all duration-300 group cursor-pointer rough-edge">
          <div className="relative h-48 overflow-hidden">
            {profile?.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center grayscale-[0.3] sepia-[0.2] transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${profile.imageUrl})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-paper-dark" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-paper-light/80 to-transparent" />

            {/* Offline-style stamp indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-paper-light border border-wood-brown/30 text-[9px] font-bold text-ink-grey uppercase italic">
              Registry Entry #{match.id.slice(0, 4)}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-wood-dark serif">
                {profile?.name || "Anonymous"}
              </h3>
              <span className="text-[10px] text-ink-grey font-bold italic serif">
                {new Date(match.timestamp).toLocaleDateString()}
              </span>
            </div>

            {profile?.interests && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {profile.interests.slice(0, 3).map((i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-paper-dark text-wood-brown border border-wood-brown/10 text-[9px] font-bold"
                  >
                    {i}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-wood-brown/10">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-ink-grey uppercase tracking-tighter">
                <svg className="w-3.5 h-3.5 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Ledger Verified
              </div>
              <div className="text-wood-brown text-xs font-bold serif group-hover:underline italic">
                Correspondence &rarr;
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function MatchNotification({ profile }: { profile: { name: string; imageUrl: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-wood-dark/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="paper-card p-12 flex flex-col items-center text-center max-w-sm relative rough-edge border-4 border-wood-brown/30 shadow-2xl"
      >
        <div className="absolute top-4 right-4 text-[10px] font-black text-wood-brown opacity-20 uppercase tracking-[0.3em] font-serif">Internal Protocol</div>
        
        <div className="relative mb-8">
          <div className="w-32 h-32 paper-card overflow-hidden border-2 border-wood-brown shadow-xl">
            <div
              className="w-full h-full bg-cover bg-center grayscale-[0.2] sepia-[0.3]"
              style={{ backgroundImage: `url(${profile.imageUrl})` }}
            />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 paper-card rounded-full bg-paper-light border-2 border-accent-forest flex items-center justify-center shadow-lg rotate-12">
            <svg className="w-6 h-6 text-accent-forest" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-wood-dark mb-4 serif stamp inline-block">Matched!</h2>
        <p className="text-base text-ink-grey serif italic leading-relaxed">
          "A mutual connection has been scribed into the ledgers between yourself and {profile.name}."
        </p>

        <div className="mt-8 pt-6 border-t border-wood-brown/10 w-full flex justify-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-wood-brown opacity-60">Verified On-Chain</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
