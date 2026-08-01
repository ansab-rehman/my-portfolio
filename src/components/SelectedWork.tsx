import { useEffect, useId, useState } from "react";
import {
  selectedWork,
  type CaseArchitecture,
  type CaseScreenshot,
  type CaseVideo,
  type WorkCase,
} from "../content";
import { useReveal } from "../hooks/useReveal";
import { emphasizeTech } from "../lib/emphasizeTech";
import { GitHubIcon } from "./SocialIcons";

const FEATURED_COUNT = 2;

function ArchitecturePanel({
  architecture,
  open,
}: {
  architecture: CaseArchitecture;
  open: boolean;
}) {
  const [activeId, setActiveId] = useState(architecture.nodes[0]?.id ?? "");
  const regionId = useId();

  if (!open) return null;

  return (
    <div
      className="case-arch"
      id={regionId}
      role="region"
      aria-label="FiscalFlow architecture"
    >
      <p className="case-arch__summary">{emphasizeTech(architecture.summary)}</p>
      <p className="case-arch__flow">
        <span className="case-arch__flow-label">Flow</span>
        {emphasizeTech(architecture.flow)}
      </p>
      <ol className="case-arch__nodes">
        {architecture.nodes.map((node, i) => {
          const active = node.id === activeId;
          return (
            <li
              key={node.id}
              className={`case-arch__node ${active ? "is-active" : ""}`}
            >
              <button
                type="button"
                className="case-arch__node-btn"
                aria-expanded={active}
                onClick={() => setActiveId(node.id)}
              >
                <span className="case-arch__node-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="case-arch__node-label">{node.label}</span>
              </button>
              {active ? (
                <p className="case-arch__node-detail">
                  {emphasizeTech(node.detail)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CaseVideoPlayer({ video }: { video: CaseVideo }) {
  return (
    <figure className="case-video">
      <div className="case-video__frame">
        <video
          className="case-video__el"
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={video.caption}
        />
        <div className="case-video__glow" aria-hidden="true" />
      </div>
      <figcaption className="case-video__caption">{video.caption}</figcaption>
    </figure>
  );
}

function CaseGallery({ shots }: { shots: CaseScreenshot[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const labelId = useId();
  const count = shots.length;
  const current = shots[active] ?? shots[0];

  useEffect(() => {
    if (count < 2 || paused) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 4200);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (!current) return null;

  const go = (next: number) => {
    setActive((next + count) % count);
  };

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
              <img src={shot.src} alt={shot.alt} loading={i === 0 ? "eager" : "lazy"} />
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
          className={`case-gallery__progress ${paused ? "is-paused" : ""}`}
          aria-hidden="true"
        >
          <span key={active} className="case-gallery__progress-bar" />
        </div>
      ) : null}
    </div>
  );
}

function CaseBlock({
  index,
  id,
  title,
  context,
  status,
  outcomes,
  tech,
  href,
  video,
  screenshots,
  architecture,
}: {
  index: number;
} & WorkCase) {
  const { ref, visible } = useReveal<HTMLElement>();
  const [archOpen, setArchOpen] = useState(false);
  const archPanelId = useId();
  const num = String(index + 1).padStart(2, "0");
  const tone = (index % 3) + 1;

  return (
    <article
      ref={ref}
      id={id}
      className={`case case--tone-${tone} reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="case__meta">
        <span className="case__index">{num}</span>
        {status ? <span className="case__status">{status}</span> : null}
      </div>
      <h3 className="case__title">{title}</h3>
      <p className="case__context">{emphasizeTech(context)}</p>
      <ul className="case__outcomes">
        {outcomes.map((line) => (
          <li key={line}>{emphasizeTech(line)}</li>
        ))}
      </ul>
      <p className="case__tech">
        {tech.split(" · ").map((token) => (
          <span key={token} className="case__tech-chip">
            <strong className="tech-term">{token}</strong>
          </span>
        ))}
      </p>

      {href ? (
        <p className="case__link-row">
          <a
            className="case__github"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="case__github-icon" />
            View on GitHub
            <span className="case__github-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </p>
      ) : null}

      {video ? <CaseVideoPlayer video={video} /> : null}
      {screenshots?.length ? <CaseGallery shots={screenshots} /> : null}

      {architecture ? (
        <div className="case__arch-wrap">
          <button
            type="button"
            className="case__arch-toggle"
            aria-expanded={archOpen}
            aria-controls={archPanelId}
            onClick={() => setArchOpen((v) => !v)}
          >
            <span>{archOpen ? "Hide architecture" : "View architecture"}</span>
            <span className="case__arch-toggle-icon" aria-hidden="true">
              {archOpen ? "−" : "+"}
            </span>
          </button>
          <div id={archPanelId}>
            <ArchitecturePanel architecture={architecture} open={archOpen} />
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function SelectedWork() {
  const [showMore, setShowMore] = useState(false);
  const featured = selectedWork.slice(0, FEATURED_COUNT);
  const more = selectedWork.slice(FEATURED_COUNT);
  const moreRegionId = useId();

  return (
    <section className="section selected" id="work" aria-labelledby="work-heading">
      <div className="section__header">
        <p className="section__eyebrow">Products</p>
        <h2 className="section__title" id="work-heading">
          Things I have built
        </h2>
        <p className="section__lede">
          Products and systems I built, separate from where I worked. Work
          experience covers the employers; this is the work itself.
        </p>
      </div>

      <div className="selected__list">
        {featured.map((item, i) => (
          <CaseBlock key={item.id} index={i} {...item} />
        ))}
      </div>

      {more.length > 0 ? (
        <div className="selected__more">
          <button
            type="button"
            className="selected__more-toggle"
            aria-expanded={showMore}
            aria-controls={showMore ? moreRegionId : undefined}
            onClick={() => setShowMore((v) => !v)}
          >
            <span>{showMore ? "Show fewer products" : "See more products"}</span>
            <span className="selected__more-icon" aria-hidden="true">
              {showMore ? "−" : "+"}
            </span>
          </button>

          {showMore ? (
            <div className="selected__list selected__list--more" id={moreRegionId}>
              {more.map((item, i) => (
                <CaseBlock key={item.id} index={FEATURED_COUNT + i} {...item} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
