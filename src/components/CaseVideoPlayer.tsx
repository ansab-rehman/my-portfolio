import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CaseVideo } from "../content";

function forceMutedAutoplay(
  video: HTMLVideoElement | null,
  playbackRate = 1,
) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playbackRate = playbackRate;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  const play = () => {
    video.playbackRate = playbackRate;
    void video.play().catch(() => {
      /* Mobile browsers may block until the next gesture; preview stays muted. */
    });
  };
  if (video.readyState >= 2) play();
  else video.addEventListener("loadeddata", play, { once: true });
}

export function CaseVideoPlayer({ video }: { video: CaseVideo }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [srcReady, setSrcReady] = useState(false);
  const lightboxTitleId = useId();
  const previewRef = useRef<HTMLVideoElement>(null);
  const lightboxRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rate = video.playbackRate ?? 1;
  const portrait = video.orientation === "portrait";
  const previewSrc = srcReady ? video.src : undefined;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSrcReady(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [video.src]);

  useEffect(() => {
    if (!srcReady) return;
    const el = previewRef.current;
    if (!el) return;

    forceMutedAutoplay(el, rate);

    const onVisibility = () => {
      if (document.visibilityState === "visible") forceMutedAutoplay(el, rate);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) forceMutedAutoplay(el, rate);
          else el.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, [video.src, rate, srcReady]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    previewRef.current?.pause();

    const id = window.requestAnimationFrame(() => {
      forceMutedAutoplay(lightboxRef.current, rate);
    });

    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      forceMutedAutoplay(previewRef.current, rate);
    };
  }, [lightboxOpen, rate]);

  const lightbox =
    lightboxOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className={`case-lightbox case-lightbox--video${portrait ? " case-lightbox--portrait" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={lightboxTitleId}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="case-lightbox__close"
              aria-label="Close fullscreen video"
              onClick={() => setLightboxOpen(false)}
            >
              ×
            </button>
            <figure
              className="case-lightbox__figure"
              onClick={(event) => event.stopPropagation()}
            >
              <video
                ref={lightboxRef}
                className="case-lightbox__video"
                src={video.src}
                poster={video.poster}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label={video.caption}
              />
              <figcaption className="case-lightbox__caption" id={lightboxTitleId}>
                {video.caption}
              </figcaption>
            </figure>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <figure className={`case-video${portrait ? " case-video--portrait" : ""}`}>
        <button
          type="button"
          className="case-video__open"
          aria-label={`View ${video.caption} fullscreen`}
          onClick={() => {
            setSrcReady(true);
            forceMutedAutoplay(previewRef.current, rate);
            setLightboxOpen(true);
          }}
        >
          <div className="case-video__frame" ref={frameRef}>
            <video
              ref={previewRef}
              className="case-video__el"
              src={previewSrc}
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="case-video__glow" aria-hidden="true" />
            <span className="case-video__hint" aria-hidden="true">
              Expand
            </span>
          </div>
        </button>
        <figcaption className="case-video__caption">{video.caption}</figcaption>
      </figure>
      {lightbox}
    </>
  );
}
