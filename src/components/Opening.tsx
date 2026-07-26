import { useEffect, useRef, useState } from "react";
import { profile } from "../content";
import portrait from "../assets/portrait.png";
import { useTheme } from "../hooks/useTheme";

const CV_HREF = "/Ansab-Rehman-CV.pdf";
const CV_FILENAME = "Ansab-Rehman-CV.pdf";

function downloadCv() {
  const link = document.createElement("a");
  link.href = CV_HREF;
  link.download = CV_FILENAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function DownloadsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="opening__downloads" ref={rootRef}>
      <button
        type="button"
        className={`opening__nav-link opening__downloads-toggle ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        Downloads
        <span className="opening__downloads-caret" aria-hidden="true">
          ↓
        </span>
      </button>
      {open ? (
        <div className="opening__downloads-menu" role="menu">
          <button
            type="button"
            className="opening__downloads-link"
            role="menuitem"
            onClick={() => {
              downloadCv();
              setOpen(false);
            }}
          >
            CV <span aria-hidden="true">PDF ↓</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

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
            Products
          </a>
          <a className="opening__nav-link" href="#tenure">
            Work experience
          </a>
          <a className="opening__nav-link" href="#craft">
            Skills
          </a>
          <DownloadsMenu />
          <a className="opening__nav-link" href="#ask">
            Ask
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
          <h1 className="opening__brand reveal-load reveal-load--1">
            <span className="opening__brand-first">{first}</span>
            {last ? (
              <>
                {" "}
                <span className="opening__brand-last">{last}</span>
              </>
            ) : null}
          </h1>
          <p className="opening__line reveal-load reveal-load--2">
            Full Stack Engineer ·{" "}
            <span className="opening__line-accent">AI-powered products</span>
          </p>
          <div className="opening__cta reveal-load reveal-load--3">
            <a className="btn btn--primary" href="#work">
              View products
              <span className="btn__arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            <button type="button" className="btn btn--ghost" onClick={downloadCv}>
              Download resume
            </button>
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
