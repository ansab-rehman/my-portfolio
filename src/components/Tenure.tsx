import type { CSSProperties } from "react";
import { tenure } from "../content";
import { useReveal } from "../hooks/useReveal";
import xrefLogo from "../assets/xref-logo.png";
import cheetayLogo from "../assets/cheetay-logo.png";
import synoraLogo from "../assets/synora-digitals-logo.svg";
import { emphasizeTech } from "../lib/emphasizeTech";
import { CaseGallery } from "./CaseGallery";
import { CaseVideoPlayer } from "./CaseVideoPlayer";

const logos: Record<string, string> = {
  "Synora Digitals": synoraLogo,
  Xref: xrefLogo,
  "Cheetay Logistics": cheetayLogo,
};

export function Tenure() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      className={`section tenure reveal ${visible ? "is-visible" : ""}`}
      id="tenure"
      aria-labelledby="tenure-heading"
      ref={ref}
    >
      <div className="section__header">
        <p className="section__eyebrow">Work experience</p>
        <h2 className="section__title" id="tenure-heading">
          Roles and impact
        </h2>
        <p className="section__lede">
          The teams I joined, the systems I improved, and the results of that
          work.
        </p>
      </div>

      <ol className="changelog">
        {tenure.map((entry, i) => (
          <li
            key={entry.id}
            className={`changelog__item changelog__item--tone-${(i % 2) + 1}`}
          >
            <div className="changelog__when">
              <time className="changelog__range">{entry.range}</time>
              <span className="changelog__dot" aria-hidden="true" />
            </div>
            <div className="changelog__body">
              <h3 className="changelog__company">
                {logos[entry.company] ? (
                  <span className="changelog__logo">
                    <img
                      src={logos[entry.company]}
                      alt={`${entry.company} logo`}
                      loading="lazy"
                    />
                  </span>
                ) : null}
                {entry.company}
                <span className="changelog__role"> · {entry.title}</span>
              </h3>

              {entry.summary ? (
                <p className="changelog__summary">{emphasizeTech(entry.summary)}</p>
              ) : null}

              {entry.linesHeading ? (
                <h4 className="changelog__impact-heading">{entry.linesHeading}</h4>
              ) : null}

              <ul className="changelog__lines">
                {entry.lines.map((line) => (
                  <li key={line}>{emphasizeTech(line)}</li>
                ))}
              </ul>

              {entry.website ? (
                <p className="changelog__link-row">
                  <a
                    className={`case__cta${entry.websiteAccent ? " case__cta--branded" : ""}`}
                    href={entry.website}
                    target="_blank"
                    rel="noreferrer"
                    style={
                      entry.websiteAccent
                        ? ({
                            "--cta-brand": entry.websiteAccent,
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    Visit website
                    <span className="case__github-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </p>
              ) : null}

              {entry.video || entry.screenshots?.length ? (
                <div
                  className={`changelog__media${
                    entry.video &&
                    entry.screenshots?.length &&
                    entry.galleryOrientation === "portrait"
                      ? " changelog__media--split"
                      : ""
                  }`}
                >
                  {entry.video ? (
                    <div className="changelog__video">
                      <CaseVideoPlayer video={entry.video} />
                    </div>
                  ) : null}

                  {entry.screenshots?.length ? (
                    <div
                      className={`changelog__gallery${entry.galleryOrientation === "portrait" ? " changelog__gallery--portrait" : ""}`}
                    >
                      <CaseGallery shots={entry.screenshots} />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
