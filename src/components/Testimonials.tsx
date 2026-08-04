import { useEffect, useId, useState, type CSSProperties } from "react";
import {
  testimonials,
  testimonialsHref,
  type Testimonial,
} from "../content";
import { useReveal } from "../hooks/useReveal";

function relativeOffset(index: number, active: number, count: number): number {
  let offset = index - active;
  const half = Math.floor(count / 2);
  if (offset > half) offset -= count;
  if (offset < -half) offset += count;
  return offset;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TestimonialCard({
  item,
  index,
  count,
  offset,
  active,
  onNext,
  onHoverChange,
}: {
  item: Testimonial;
  index: number;
  count: number;
  offset: number;
  active: boolean;
  onNext: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const abs = Math.abs(offset);
  const hidden = abs > 2;

  return (
    <article
      className={`testimonials__card testimonials__card--${item.gender}${active ? " is-active" : ""}${hidden ? " is-hidden" : ""}`}
      style={
        {
          "--t-offset": offset,
          "--t-abs": abs,
        } as CSSProperties
      }
      aria-hidden={hidden}
      data-offset={offset}
      onMouseEnter={active ? () => onHoverChange(true) : undefined}
      onMouseLeave={active ? () => onHoverChange(false) : undefined}
    >
      {!active ? (
        <button
          type="button"
          className="testimonials__hit"
          onClick={onNext}
          tabIndex={abs === 1 ? 0 : -1}
          aria-label="Show next recommendation"
        />
      ) : null}

      <div
        className="testimonials__card-inner"
        onClick={active ? onNext : undefined}
      >
        <div className="testimonials__top">
          <p className="testimonials__kicker">LinkedIn recommendation</p>
          <span className="testimonials__index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>

        <blockquote className="testimonials__quote">
          <span className="testimonials__mark" aria-hidden="true">
            “
          </span>
          <p>{item.quote}</p>
        </blockquote>

        <footer className="testimonials__meta">
          <div
            className="testimonials__avatar"
            aria-hidden="true"
            data-gender={item.gender}
          >
            {initials(item.name)}
          </div>
          <div className="testimonials__identity">
            <a
              className="testimonials__name"
              href={item.profileUrl}
              target="_blank"
              rel="noreferrer"
              tabIndex={active ? 0 : -1}
              onClick={(event) => event.stopPropagation()}
            >
              {item.name}
            </a>
            <p className="testimonials__role">{item.title}</p>
            <p className="testimonials__date">{item.date}</p>
          </div>
          {active ? (
            <a
              className="testimonials__linkedin"
              href={testimonialsHref}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              Full note
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

export function Testimonials() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const labelId = useId();
  const count = testimonials.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 5600);
    return () => window.clearInterval(id);
  }, [count, paused]);

  useEffect(() => {
    setPaused(false);
  }, [active]);

  const go = (next: number) => {
    setActive((next + count) % count);
  };

  return (
    <section
      className={`section testimonials reveal ${visible ? "is-visible" : ""}`}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      ref={ref}
    >
      <div className="section__header">
        <p className="section__eyebrow">Testimonials</p>
        <h2 className="section__title" id="testimonials-heading">
          What colleagues say
        </h2>
        <p className="section__lede">
          Recommendations from Xref leaders and teammates — short excerpts here,
          full notes on LinkedIn.
        </p>
      </div>

      <div
        className="testimonials__stage"
        aria-roledescription="carousel"
        aria-label="LinkedIn recommendations"
      >
        <div className="testimonials__viewport" aria-live="polite">
          {testimonials.map((item, index) => (
            <TestimonialCard
              key={item.id}
              item={item}
              index={index}
              count={count}
              offset={relativeOffset(index, active, count)}
              active={index === active}
              onNext={() => go(active + 1)}
              onHoverChange={setPaused}
            />
          ))}
        </div>

        <div className="testimonials__controls">
          <button
            type="button"
            className="testimonials__nav"
            aria-label="Previous recommendation"
            onClick={() => go(active - 1)}
          >
            ←
          </button>
          <div
            className="testimonials__dots"
            role="tablist"
            aria-label="Choose a recommendation"
          >
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${labelId}-tab-${index}`}
                className={`testimonials__dot${index === active ? " is-active" : ""}`}
                aria-selected={index === active}
                aria-label={item.name}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="testimonials__nav"
            aria-label="Next recommendation"
            onClick={() => go(active + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
