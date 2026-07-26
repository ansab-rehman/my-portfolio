import { selectedWork } from "../content";
import { useReveal } from "../hooks/useReveal";

function CaseBlock({
  index,
  title,
  context,
  status,
  outcomes,
  tech,
}: {
  index: number;
  title: string;
  context: string;
  status?: string;
  outcomes: string[];
  tech: string;
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  const num = String(index + 1).padStart(2, "0");
  const tone = (index % 3) + 1;

  return (
    <article
      ref={ref}
      className={`case case--tone-${tone} reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="case__meta">
        <span className="case__index">{num}</span>
        {status ? <span className="case__status">{status}</span> : null}
      </div>
      <h3 className="case__title">{title}</h3>
      <p className="case__context">{context}</p>
      <ul className="case__outcomes">
        {outcomes.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="case__tech">
        {tech.split(" · ").map((token) => (
          <span key={token} className="case__tech-chip">
            {token}
          </span>
        ))}
      </p>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section className="section selected" id="work" aria-labelledby="work-heading">
      <div className="section__header">
        <p className="section__eyebrow">Selected work</p>
        <h2 className="section__title" id="work-heading">
          Proof over pitch
        </h2>
        <p className="section__lede">
          Products and systems I built — separate from where I worked. Tenure
          covers the employers; this is the work itself.
        </p>
      </div>

      <div className="selected__list">
        {selectedWork.map((item, i) => (
          <CaseBlock key={item.id} index={i} {...item} />
        ))}
      </div>
    </section>
  );
}
