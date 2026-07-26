import { useEffect, useRef } from "react";
import { profile } from "../content";
import portrait from "../assets/portrait.png";
import { useTheme } from "../hooks/useTheme";

export function Opening() {
  const stageRef = useRef<HTMLElement | null>(null);
  const { theme, toggle, isDay } = useTheme();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <header className="opening" id="top" ref={stageRef}>
      <div className="opening__atmosphere" aria-hidden="true" />
      <div className="opening__spot" aria-hidden="true" />
      <div className="opening__topbar">
        <nav className="opening__nav" aria-label="Primary">
          <a className="opening__nav-link" href="#work">
            Work
          </a>
          <a className="opening__nav-link" href="#tenure">
            Tenure
          </a>
          <a className="opening__nav-link" href="#craft">
            Craft
          </a>
          <a className="opening__nav-link" href="#contact">
            Contact
          </a>
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
          aria-pressed={isDay}
          title={isDay ? "Night mode" : "Day mode"}
        >
          <span className="theme-toggle__track" aria-hidden="true">
            <span className={`theme-toggle__thumb theme-toggle__thumb--${theme}`}>
              <span className="theme-toggle__icon" />
            </span>
          </span>
          <span className="theme-toggle__label">{isDay ? "Day" : "Night"}</span>
        </button>
      </div>

      <div className="opening__stage">
        <div className="opening__copy">
          <p className="opening__meta reveal-load reveal-load--1">
            <span className="opening__pulse" aria-hidden="true" />
            {profile.location}
          </p>
          <h1 className="opening__brand reveal-load reveal-load--2">
            <span className="opening__brand-first">{first}</span>
            {last ? (
              <>
                {" "}
                <span className="opening__brand-last">{last}</span>
              </>
            ) : null}
          </h1>
          <p className="opening__line reveal-load reveal-load--3">
            Full Stack Engineer ·{" "}
            <span className="opening__line-accent">AI-powered products</span>
          </p>
          <div className="opening__cta reveal-load reveal-load--4">
            <a className="btn btn--primary" href="#work">
              View work
              <span className="btn__arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
              Email
            </a>
          </div>
        </div>

        <figure className="opening__portrait reveal-load reveal-load--3">
          <img
            src={portrait}
            alt="Portrait of Ansab Rehman"
            width={1024}
            height={1024}
            loading="eager"
          />
        </figure>
      </div>
    </header>
  );
}
