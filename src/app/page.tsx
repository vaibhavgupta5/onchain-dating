"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useSwipe } from "@/hooks/use-swipe";
import { useContractEvents } from "@/hooks/use-contract-events";
import { useContractState } from "@/hooks/use-contract-reads";
import { useAppStore } from "@/store/app-store";
import { SwipeCard, EmptySwipeState } from "@/components/swipe-card";
import { MatchNotification } from "@/components/match-card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { fetchFromIPFS } from "@/lib/ipfs";
import type { UserProfile } from "@/lib/types";

export default function DiscoverPage() {
  const { isConnected, hasProfile } = useAuth();
  const { matches, setProfiles } = useAppStore();
  const {
    currentProfile,
    hasMoreProfiles,
    handleLike,
    handlePass,
    isLoading,
    txError,
  } = useSwipe();

  const { state: contractState } = useContractState();
  useContractEvents();

  const [showMatch, setShowMatch] = useState(false);
  const [matchProfile, setMatchProfile] = useState<{
    name: string;
    imageUrl: string;
  } | null>(null);
  const [prevMatchCount, setPrevMatchCount] = useState(0);
  const [profileCids, setProfileCids] = useState("");
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Load profiles from IPFS CIDs (comma separated, entered by user or fetched from a registry)
  const loadProfilesFromIPFS = useCallback(async () => {
    if (!profileCids.trim()) return;
    setLoadingProfiles(true);
    try {
      const cids = profileCids.split(",").map((c) => c.trim()).filter(Boolean);
      const profiles: UserProfile[] = [];
      for (const cid of cids) {
        try {
          const data = await fetchFromIPFS<{
            name: string;
            age: number;
            bio: string;
            interests: string[];
            imageCid?: string;
            address: string;
            identityHash: string;
            createdAt: number;
          }>(cid);
          profiles.push({
            ...data,
            imageUrl: data.imageCid
              ? `https://gateway.pinata.cloud/ipfs/${data.imageCid}`
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.address}`,
            ipfsCid: cid,
          });
        } catch (err) {
          console.error(`Failed to load profile CID ${cid}:`, err);
        }
      }
      if (profiles.length > 0) {
        setProfiles(profiles);
      }
    } finally {
      setLoadingProfiles(false);
    }
  }, [profileCids, setProfiles]);

  useEffect(() => {
    if (matches.length > prevMatchCount && matches.length > 0) {
      const latest = matches[matches.length - 1];
      if (latest.profile) {
        setMatchProfile({
          name: latest.profile.name,
          imageUrl: latest.profile.imageUrl,
        });
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 3000);
      }
    }
    setPrevMatchCount(matches.length);
  }, [matches, prevMatchCount]);

  if (!isConnected) {
    return (
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center pt-12 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl w-full text-center"
        >
          {/* Hero Icon */}
          <motion.div
            className="relative w-32 h-32 mx-auto mb-10"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative h-full w-full paper-card flex items-center justify-center shadow-lg border-2 border-wood-brown ring-4 ring-wood-brown/10">
              <svg
                className="w-16 h-16 text-wood-brown"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-wood-brown/30" />
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight serif text-wood-dark">
            HelaMatch
          </h1>
          
          <p className="text-xl md:text-2xl text-ink-grey italic font-medium mb-8 serif">
            "A courtship secured by the ledge, verified by time."
          </p>
          
          <p className="text-base text-ink-black/70 mb-12 max-w-lg mx-auto leading-relaxed font-medium">
            The world's first privacy-first dating protocol. Verified by the Hela Ledger, archival storage on IPFS, and identity via Zero-Knowledge.
          </p>

          <div className="flex flex-col items-center gap-4 mb-20">
            <div className="relative group p-4 paper-card border-dashed border-2 border-wood-brown/40">
              <div className="relative">
                <ConnectButton />
              </div>
            </div>
            <p className="text-[10px] text-ink-grey uppercase tracking-widest font-bold font-sans">
              Establish Secure Connection
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                label: "Ledger Trust",
                desc: "Every connection is an immutable entry on the Hela chain.",
                color: "text-wood-brown"
              },
              {
                icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101",
                label: "Archive Storage",
                desc: "Your data belongs to you. Distributed across the great IPFS.",
                color: "text-ink-grey"
              },
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                label: "Veiled Identity",
                desc: "Zero-knowledge proofs for uncompromised verification.",
                color: "text-wood-dark"
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="paper-card p-6 text-left border-wood-brown/20 hover:border-wood-brown/50 transition-all group rough-edge"
              >
                <div className={`w-12 h-12 mb-4 rounded-full bg-paper-dark flex items-center justify-center border border-wood-brown/10`}>
                  <svg
                    className={`w-6 h-6 ${feat.color}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-wood-dark mb-2 serif">{feat.label}</h3>
                <p className="text-xs text-ink-grey leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 paper-card p-12 max-w-md w-full text-center rough-edge border-2 border-wood-brown/20 shadow-xl"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="h-full w-full rounded-full bg-paper-dark flex items-center justify-center border-2 border-dashed border-wood-brown/30">
              <svg
                className="w-10 h-10 text-wood-brown"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-paper-light border border-wood-brown px-2 py-0.5 text-[8px] font-bold text-wood-brown stamp">Required</div>
          </div>
          
          <h2 className="text-3xl font-black text-wood-dark mb-4 serif">
            Identify Yourself
          </h2>
          <p className="text-base text-ink-black/70 mb-10 leading-relaxed font-medium capitalize italic">
            To begin your journey, you must first scribe your profile into the IPFS archive.
          </p>
          
          <a href="/profile" className="wood-button w-full inline-block py-4 text-center text-lg shadow-lg">
            Create Profile
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 relative">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12 pt-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-block px-3 py-1 border-2 border-wood-brown text-wood-brown mb-6 serif italic font-bold">
          <span className="text-xs uppercase tracking-widest">The Hela Gazette • Vol. I</span>
        </div>
        <h1 className="text-5xl font-black text-wood-dark mb-4 serif">The Registry</h1>
        <p className="text-base text-ink-grey italic serif font-medium">
          "Finding true connection through the immutable ledger."
        </p>
        <div className="w-24 h-px bg-wood-brown/30 mx-auto mt-6" />
      </motion.div>

      {/* Profile Discovery Settings */}
      <motion.div
        className="paper-card p-6 mb-12 max-w-md mx-auto border-wood-brown/20 rough-edge"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6 border-b border-wood-brown/10 pb-4">
          <div className="w-10 h-10 bg-paper-dark flex items-center justify-center border border-wood-brown/20 shadow-inner">
            <svg className="w-5 h-5 text-wood-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-wood-dark serif">IPFS Courier</h3>
            <p className="text-[10px] text-ink-grey uppercase tracking-widest font-bold">Summon Profiles</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <textarea
            value={profileCids}
            onChange={(e) => setProfileCids(e.target.value)}
            placeholder="Scribe CID addresses here, separated by the modest comma..."
            className="text-xs py-3 px-4 resize-none h-20 placeholder:italic serif"
          />
          <button
            onClick={loadProfilesFromIPFS}
            disabled={loadingProfiles || !profileCids.trim()}
            className="wood-button w-full text-xs py-3 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loadingProfiles ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Summoning...</span>
              </>
            ) : "Summon Profiles"}
          </button>
        </div>
      </motion.div>

      {/* Transaction error */}
      {txError && (
        <div className="max-w-sm mx-auto mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
          {txError}
        </div>
      )}

      {/* Swipe area */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-sm" style={{ minHeight: "520px" }}>
          <AnimatePresence mode="wait">
            {hasMoreProfiles && currentProfile ? (
              <SwipeCard
                key={currentProfile.address}
                profile={currentProfile}
                onLike={handleLike}
                onPass={handlePass}
                isLoading={isLoading}
              />
            ) : (
              <EmptySwipeState key="empty" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* On-chain Network Status */}
      <motion.div
        className="flex flex-wrap justify-center gap-12 mt-20 p-8 pt-12 border-t border-wood-brown/10 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper-dark px-4 serif italic text-xs text-ink-grey">Ledger Observations</div>
        
        {[
          {
            label: "Scribe Fee",
            value: contractState
              ? `${formatEther(contractState.likeFee)} HELA`
              : "...",
            color: "text-wood-brown",
            icon: "M13 10V3L4 14h7v7l9-11h-7z"
          },
          {
            label: "Truth Status",
            value: "Veiled (ZK)",
            color: "text-accent-forest",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          },
          {
            label: "Public Acts",
            value: contractState
              ? `${parseInt(contractState.totalMatches.toString()) + parseInt(contractState.totalLikes.toString())} Entries`
              : "...",
            color: "text-ink-black",
            icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center group">
            <div className={`w-6 h-6 ${stat.color} mb-3 group-hover:scale-125 transition-transform opacity-60`}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
            </div>
            <p className="text-[9px] text-ink-grey uppercase tracking-[0.2em] font-bold mb-1">
              {stat.label}
            </p>
            <p className={`text-lg font-black serif ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Match notification overlay */}
      <AnimatePresence>
        {showMatch && matchProfile && (
          <MatchNotification profile={matchProfile} />
        )}
      </AnimatePresence>
    </div>
  );
}
