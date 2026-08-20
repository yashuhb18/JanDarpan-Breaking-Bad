import React, { useState } from 'react';
import { Shield, ShieldCheck, ExternalLink, Copy, CheckCircle, Link2 } from 'lucide-react';

/**
 * ⛓️ BlockchainBadge Component
 * Shows verification status for blockchain-hashed transactions.
 * Displays SHA-256 hash, Polygon explorer link, and chain integrity status.
 */
const BlockchainBadge = ({ hashEntry, compact = false, showDetails = false }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!hashEntry) return null;

    const { dataHash, previousHash, blockNumber, txType, timestamp, polygonTxHash, isOnChain } = hashEntry;

    const shortHash = dataHash ? `${dataHash.substring(0, 10)}...${dataHash.substring(dataHash.length - 6)}` : '—';
    const shortPrevHash = previousHash ? `${previousHash.substring(0, 10)}...${previousHash.substring(previousHash.length - 6)}` : '—';

    const copyHash = async () => {
        if (dataHash) {
            await navigator.clipboard.writeText(dataHash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const explorerUrl = polygonTxHash 
        ? `https://amoy.polygonscan.com/tx/${polygonTxHash}` 
        : null;

    const txTypeLabels = {
        SANCTION: "PROJECT SANCTION",
        TRANCHE_RELEASE: "TRANCHE RELEASE",
        SPENDING: "SPENDING ENTRY",
        AI_AUDIT: "AI AUDIT VERDICT",
        FUND_FREEZE: "FUND FREEZE",
        MILESTONE_CLAIM: "MILESTONE CLAIM"
    };

    // Compact inline badge
    if (compact) {
        return (
            <div 
                className="inline-flex items-center gap-1 cursor-pointer group"
                onClick={() => setShowTooltip(!showTooltip)}
                title={`Block #${blockNumber} | Hash: ${dataHash}`}
            >
                <div className={`flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                    isOnChain 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                        : 'bg-slate-900 text-slate-300 border-slate-600'
                }`}>
                    {isOnChain ? <ShieldCheck size={9} /> : <Shield size={9} />}
                    <span>{isOnChain ? 'ON-CHAIN' : 'HASHED'}</span>
                    <span className="opacity-60">#{blockNumber}</span>
                </div>

                {showTooltip && (
                    <div className="absolute z-50 mt-1 top-full left-0 w-64 bg-swiss-black text-swiss-white p-3 border-2 border-swiss-white/20 shadow-brutal space-y-1.5 font-inter"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-swiss-accent uppercase">
                                ⛓️ BLOCK #{blockNumber}
                            </span>
                            <button onClick={copyHash} className="text-[9px] font-black uppercase text-swiss-white/60 hover:text-swiss-accent flex items-center gap-0.5">
                                {copied ? <CheckCircle size={9} /> : <Copy size={9} />}
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                        <div className="text-[9px] font-mono text-swiss-white/80 break-all">{shortHash}</div>
                        {explorerUrl && (
                            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" 
                               className="text-[9px] font-black uppercase text-emerald-400 hover:underline flex items-center gap-1">
                                <ExternalLink size={9} /> VIEW ON POLYGON EXPLORER
                            </a>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Full detail card (used in Money Trail modal)
    return (
        <div className="border-2 border-swiss-black bg-slate-950 text-swiss-white p-4 space-y-3 font-inter relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 border ${isOnChain ? 'bg-emerald-900 border-emerald-600' : 'bg-slate-800 border-slate-600'}`}>
                        {isOnChain ? <ShieldCheck size={16} className="text-emerald-400" /> : <Shield size={16} className="text-slate-400" />}
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent block">
                            ⛓️ BLOCK #{blockNumber} — {txTypeLabels[txType] || txType}
                        </span>
                        <span className="text-[9px] font-bold text-swiss-white/50 uppercase">
                            {new Date(timestamp).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className={`px-2 py-1 text-[8px] font-black uppercase border ${
                    isOnChain 
                        ? 'bg-emerald-900 text-emerald-300 border-emerald-600' 
                        : 'bg-slate-800 text-slate-400 border-slate-600'
                }`}>
                    {isOnChain ? '✅ ON-CHAIN VERIFIED' : '🔒 LOCAL HASH SECURED'}
                </div>
            </div>

            {/* Hash Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-swiss-white/40 tracking-widest">SHA-256 DATA HASH</span>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-2 border border-slate-700">
                        <code className="text-[9px] font-mono text-emerald-300 break-all flex-1">{shortHash}</code>
                        <button onClick={copyHash} className="text-slate-400 hover:text-swiss-accent shrink-0">
                            {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-swiss-white/40 tracking-widest">PREVIOUS BLOCK HASH</span>
                    <div className="bg-slate-900 p-2 border border-slate-700">
                        <code className="text-[9px] font-mono text-slate-400 break-all flex items-center gap-1">
                            <Link2 size={9} className="shrink-0 text-swiss-accent" /> {shortPrevHash}
                        </code>
                    </div>
                </div>
            </div>

            {/* Polygon Explorer Link */}
            {explorerUrl && (
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-center gap-2 p-2 bg-emerald-900/50 text-emerald-300 border border-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-colors">
                    <ExternalLink size={12} />
                    VERIFY ON POLYGON AMOY EXPLORER →
                </a>
            )}
        </div>
    );
};

/**
 * ⛓️ BlockchainChainSummary Component
 * Shows a compact summary of the entire hash chain integrity
 */
export const BlockchainChainSummary = ({ blockchainHashes = [] }) => {
    if (!blockchainHashes || blockchainHashes.length === 0) return null;

    const onChainCount = blockchainHashes.filter(h => h.isOnChain).length;

    return (
        <div className="border-2 border-swiss-black bg-slate-950 text-swiss-white p-4 space-y-3 font-inter">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-swiss-white">
                        ⛓️ IMMUTABLE BLOCKCHAIN AUDIT TRAIL
                    </span>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 bg-emerald-900 text-emerald-300 border border-emerald-700">
                    {blockchainHashes.length} BLOCKS | {onChainCount} ON-CHAIN
                </span>
            </div>

            {/* Visual Chain */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {blockchainHashes.map((hash, idx) => (
                    <div key={idx} className="flex items-center shrink-0">
                        <div className={`w-8 h-8 border-2 flex items-center justify-center text-[8px] font-black ${
                            hash.isOnChain 
                                ? 'bg-emerald-900 border-emerald-600 text-emerald-300' 
                                : 'bg-slate-800 border-slate-600 text-slate-400'
                        }`} title={`Block #${hash.blockNumber}: ${hash.txType}\nHash: ${hash.dataHash}`}>
                            #{hash.blockNumber}
                        </div>
                        {idx < blockchainHashes.length - 1 && (
                            <div className="w-4 h-0.5 bg-emerald-600"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Block List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {blockchainHashes.map((hash, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-700 text-[9px] font-bold uppercase">
                        <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 text-[7px] font-black border ${
                                hash.isOnChain 
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                                    : 'bg-slate-800 text-slate-400 border-slate-600'
                            }`}>
                                #{hash.blockNumber}
                            </span>
                            <span className="text-swiss-accent">{hash.txType.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="text-[8px] font-mono text-slate-400">
                                {hash.dataHash.substring(0, 12)}...
                            </code>
                            {hash.isOnChain && (
                                <span className="text-emerald-400">
                                    <ShieldCheck size={10} />
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainBadge;
