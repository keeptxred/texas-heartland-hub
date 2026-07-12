import React, { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Facebook,
  Linkedin,
  Mail,
  Share2,
  Twitter,
} from "lucide-react";

interface ShareResultsProps {
  title: string;
  summary: string;
  url?: string;
}

export default function ShareResults({
  title,
  summary,
  url,
}: ShareResultsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (url) return url;

    if (typeof window !== "undefined") {
      return window.location.href;
    }

    return "";
  }, [url]);

  const shareText = `${title}\n\n${summary}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function handleNativeShare() {
    if (!canNativeShare) return;

    try {
      await navigator.share({
        title,
        text: summary,
        url: shareUrl,
      });
    } catch {
      // User cancelled sharing
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  }

  return (
    <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-2">

        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Share2 size={22} />
          Share Your Results
        </h2>

        <p className="text-gray-600">
          Share this calculator or your results with friends,
          family, or your real estate professional.
        </p>

      </div>

      <div className="mt-6 flex flex-wrap gap-3">

        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="rounded-lg bg-red-700 px-4 py-3 font-medium text-white transition hover:bg-red-800"
          >
            Share
          </button>
        )}

        <button
          onClick={copyLink}
          className="flex items-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50"
        >
          {copied ? (
            <>
              <Check size={18} />
              Copied
            </>
          ) : (
            <>
              <Copy size={18} />
              Copy Link
            </>
          )}
        </button>

        <a
          href={`mailto:?subject=${encodeURIComponent(
            title
          )}&body=${encodedText}%0A%0A${encodedUrl}`}
          className="flex items-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50"
        >
          <Mail size={18} />
          Email
        </a>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
          className="flex items-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50"
        >
          <Twitter size={18} />
          X
        </a>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          className="flex items-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50"
        >
          <Facebook size={18} />
          Facebook
        </a>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          className="flex items-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50"
        >
          <Linkedin size={18} />
          LinkedIn
        </a>

      </div>

    </section>
  );
}
