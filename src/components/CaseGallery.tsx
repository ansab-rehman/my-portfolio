import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { CaseScreenshot } from "../content";

export function CaseGallery({ shots }: { shots: CaseScreenshot[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const labelId = useId();
  const lightboxTitleId = useId();
  const count = shots.length;
  const current = shots[active] ?? shots[0];
  const autoplayPaused = paused || lightboxOpen;

  useEffect(() => {
    if (count < 2 || autoplayPaused) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 4200);
    return () => window.clearInterval(id);
  }, [count, autoplayPaused]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      } else if (event.key === "ArrowLeft" && count > 1) {
        setActive((i) => (i - 1 + count) % count);
      } else if (event.key === "ArrowRight" && count > 1) {
        setActive((i) => (i + 1) % count);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, count]);

  if (!current) return null;

  const go = (next: number) => {
    setActive((next + count) % count);
  };

  const lightbox =
    lightboxOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="case-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby={lightboxTitleId}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="case-lightbox__close"
              aria-label="Close fullscreen image"
              onClick={() => setLightboxOpen(false)}
            >
              ×
            </button>

            {count > 1 ? (
              <>
                <button
                  type="button"
                  className="case-lightbox__nav case-lightbox__nav--prev"
                  aria-label="Previous screenshot"
                  onClick={(event) => {
                    event.stopPropagation();
                    go(active - 1);
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="case-lightbox__nav case-lightbox__nav--next"
                  aria-label="Next screenshot"
                  onClick={(event) => {
                    event.stopPropagation();
                    go(active + 1);
                  }}
                >
                  ›
                </button>
              </>
            ) : null}

            <figure
              className="case-lightbox__figure"
              onClick={(event) => event.stopPropagation()}
            >
              <img src={current.src} alt={current.alt} />
              <figcaption className="case-lightbox__caption" id={lightboxTitleId}>
                {count > 1 ? (
                  <span className="case-lightbox__index" aria-hidden="true">
                    {String(active + 1).padStart(2, "0")}
                    <span>/</span>
                    {String(count).padStart(2, "0")}
                  </span>
                ) : null}
                {current.caption}
              </figcaption>
            </figure>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      className="case-gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="case-gallery__frame"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
      >
        <div className="case-gallery__viewport">
          {shots.map((shot, i) => (
            <figure
              key={shot.caption}
              className={`case-gallery__slide ${i === active ? "is-active" : ""}`}
              aria-hidden={i !== active}
            >
              <button
                type="button"
                className="case-gallery__open"
                aria-label={`View ${shot.alt} fullscreen`}
                onClick={() => setLightboxOpen(true)}
              >
                <img src={shot.src} alt="" loading={i === 0 ? "eager" : "lazy"} />
              </button>
            </figure>
          ))}
          <div className="case-gallery__glow" aria-hidden="true" />
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              className="case-gallery__nav case-gallery__nav--prev"
              aria-label="Previous screenshot"
              onClick={() => go(active - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="case-gallery__nav case-gallery__nav--next"
              aria-label="Next screenshot"
              onClick={() => go(active + 1)}
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      <div className="case-gallery__meta">
        <p className="case-gallery__caption" id={labelId}>
          <span className="case-gallery__index" aria-hidden="true">
            {String(active + 1).padStart(2, "0")}
            <span className="case-gallery__index-sep">/</span>
            {String(count).padStart(2, "0")}
          </span>
          {current.caption}
        </p>

        {count > 1 ? (
          <div className="case-gallery__dots" role="tablist" aria-label="Screenshots">
            {shots.map((shot, i) => (
              <button
                key={shot.caption}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={shot.caption}
                className={`case-gallery__dot ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          className={`case-gallery__progress ${autoplayPaused ? "is-paused" : ""}`}
          aria-hidden="true"
        >
          <span key={active} className="case-gallery__progress-bar" />
        </div>
      ) : null}

      {lightbox}
    </div>
  );
}
