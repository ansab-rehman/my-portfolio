import { tenure } from "../content";
import { useReveal } from "../hooks/useReveal";
import xrefLogo from "../assets/xref-logo.png";
import cheetayLogo from "../assets/cheetay-logo.png";
import { emphasizeTech } from "../lib/emphasizeTech";

const logos: Record<string, string> = {
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
              <ul className="changelog__lines">
                {entry.lines.map((line) => (
                  <li key={line}>{emphasizeTech(line)}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
