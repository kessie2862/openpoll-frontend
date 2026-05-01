'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Code2,
  ExternalLink,
  Check,
  Link2,
  Globe,
} from 'lucide-react';
import { Poll } from '@/src/types';
import { notify } from '@/src/lib/toast';

interface ShareModalProps {
  poll: Poll;
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ poll, open, onClose }: ShareModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const pollUrl = `${window.location.origin}/polls/${poll.short_id}`;

  const embedBase = process.env.NEXT_PUBLIC_EMBED_BASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_EMBED_BASE_URL
    : `${window.location.origin}/embed`;

  const embedUrl = `${embedBase}/${poll.short_id}/`;
  const embedCode = `<iframe\n  src="${embedUrl}"\n  width="520"\n  height="480"\n  frameborder="0"\n  style="border-radius:12px"\n></iframe>`;

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    notify.copied();
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
          >
            <div className="w-full max-w-lg my-auto bg-(--bg-surface) border border-(--border) rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-(--border) shrink-0">
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-(--accent)" />
                  <div>
                    <h2 className="font-bold text-sm">Share & Embed</h2>
                    <p className="text-xs text-(--text-muted) mt-0.5 truncate max-w-xs">
                      {poll.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated) transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Poll link */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                    <Link2 size={11} /> Poll link
                  </label>
                  <CopyField
                    value={pollUrl}
                    onCopy={() => copy(pollUrl, 'link')}
                    copied={copiedField === 'link'}
                  />
                  <p className="text-xs text-(--text-muted) mt-1.5">
                    Share this URL anywhere. Social media, email, messaging apps
                  </p>
                </div>

                {/* Embed code */}
                {poll.embed_enabled && (
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                      <Code2 size={11} /> Embed code
                    </label>
                    <div className="relative">
                      <pre className="bg-(--bg-base) border border-(--border) rounded-xl p-4 text-xs text-(--text-secondary) font-mono overflow-x-auto whitespace-pre leading-relaxed">
                        {embedCode}
                      </pre>
                      <button
                        onClick={() => copy(embedCode, 'embed')}
                        className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          copiedField === 'embed'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-(--bg-elevated) border-(--border) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-bright)'
                        }`}
                      >
                        {copiedField === 'embed' ? (
                          <>
                            <Check size={11} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={11} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-(--text-muted) mt-1.5">
                      Paste this into any website, Notion page, or CMS that
                      accepts HTML
                    </p>

                    {/* Live iframe preview */}
                    <div className="mt-4">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                        <ExternalLink size={11} /> Live preview
                      </label>
                      <div className="rounded-xl overflow-hidden border border-(--border) bg-(--bg-base)">
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height="300"
                          frameBorder="0"
                          title="Poll embed preview"
                          className="block"
                        />
                      </div>
                      <p className="text-xs text-(--text-muted) mt-1.5">
                        This is exactly how your poll looks when embedded
                      </p>
                    </div>
                  </div>
                )}

                {/* Embed disabled notice */}
                {!poll.embed_enabled && (
                  <div className="bg-(--bg-elevated) border border-(--border) rounded-xl px-4 py-3">
                    <p className="text-xs text-(--text-muted)">
                      Embedding is disabled for this poll. The poll creator can
                      enable it in poll settings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CopyField({
  value,
  onCopy,
  copied,
}: {
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={value}
        className="field flex-1 text-sm font-mono text-(--text-secondary) cursor-text"
        onFocus={(e) => e.target.select()}
      />
      <button
        onClick={onCopy}
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
          copied
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-(--bg-elevated) border-(--border) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-bright)'
        }`}
      >
        {copied ? (
          <>
            <Check size={12} /> Copied
          </>
        ) : (
          <>
            <Copy size={12} /> Copy
          </>
        )}
      </button>
    </div>
  );
}
